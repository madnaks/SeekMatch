using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using SeekMatch.Infrastructure.Repositories;
using System.IO;

namespace SeekMatch.Application.Services
{
    public class ResumeService(IResumeRepository resumeRepository, IMapper mapper, IFileStorageService fileStorageService) : IResumeService
    {
        public async Task<IList<ResumeDto>?> GetAllAsync(string talentId) => 
            mapper.Map<IList<ResumeDto>>(await resumeRepository.GetAllAsync(talentId));

        public async Task<FileDownloadResult> DownloadResume(string resumeId)
        {
            var resume = await resumeRepository.GetByIdAsync(resumeId);
            if (resume == null)
                throw new Exception("Resume not found");

            if (resume.FilePath == null)
                throw new Exception("Resume not found for this express application");

            var stream = await fileStorageService.OpenReadAsync(resume.FilePath);
            var fileName = Path.GetFileName(resume.FilePath);

            return new FileDownloadResult(stream, fileName, "application/pdf");
        }

        public async Task<bool> CreateAsync(ResumeDto resumeDto, string talentId, Stream resumeStream, string fileName)
        {
            var resume = mapper.Map<Resume>(resumeDto);

            var newResumeGuid = Guid.NewGuid().ToString();

            resume.Id = newResumeGuid;
            resume.TalentId = talentId;

            var resumePath = await fileStorageService.SaveFileAsync(resumeStream, $"{newResumeGuid}_{fileName}");
            resume.FilePath = resumePath;

            return await resumeRepository.CreateAsync(resume);
        }

        public async Task<bool> UpdateAsync(ResumeDto resumeDto)
        {
            if (resumeDto != null && !string.IsNullOrEmpty(resumeDto.Id))
            {
                var existingResume = await resumeRepository.GetByIdAsync(resumeDto.Id);
                if (existingResume == null)
                    throw new Exception("Resume not found");

                mapper.Map(resumeDto, existingResume);

                return await resumeRepository.UpdateAsync(existingResume);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string resumeId)
        {
            var resume = await resumeRepository.GetByIdAsync(resumeId);
            
            if (resume == null) 
                return false;

            var deleted = await resumeRepository.DeleteAsync(resumeId);

            if (deleted && !string.IsNullOrEmpty(resume.FilePath))
            {
                try
                {
                    await fileStorageService.DeleteFileAsync(resume.FilePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Warning: could not delete file {resume.FilePath}. {ex.Message}");
                }
            }

            return deleted;
        }

    }
}
