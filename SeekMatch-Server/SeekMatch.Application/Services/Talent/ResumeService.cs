using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Application.Services
{
    public class ResumeService(IResumeRepository resumeRepository, IMapper mapper, IFileStorageService fileStorageService) : IResumeService
    {
        public async Task<IList<ResumeDto>?> GetAllAsync(string talentId)
        {
            return mapper.Map<IList<ResumeDto>>(await resumeRepository.GetAllAsync(talentId));
        }

        public async Task<FileDownloadResult> DownloadResume(string resumeId)
        {
            var resume = await resumeRepository.GetByIdAsync(resumeId);

            if (resume == null)
            {
                throw new Exception("Resume not found");
            }

            if (resume.FilePath == null)
            {
                throw new Exception("Resume not found for this express application");
            }

            var stream = await fileStorageService.OpenReadAsync(resume.FilePath);
            var fileName = Path.GetFileName(resume.FilePath);

            return new FileDownloadResult(stream, fileName, "application/pdf");
        }

        public async Task<bool> CreateAsync(ResumeDto resumeDto, string talentId)
        {
            var resume = mapper.Map<Resume>(resumeDto);
            resume.Id = Guid.NewGuid().ToString();
            resume.TalentId = talentId;
            return await resumeRepository.CreateAsync(resume);
        }

        public async Task<bool> UpdateAsync(ResumeDto resumeDto)
        {
            if (resumeDto != null && !string.IsNullOrEmpty(resumeDto.Id))
            {
                var existingResume = await resumeRepository.GetByIdAsync(resumeDto.Id);
                if (existingResume == null)
                {
                    throw new Exception("Resume not found");
                }

                mapper.Map(resumeDto, existingResume);

                return await resumeRepository.UpdateAsync(existingResume);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string resumeId)
        {
            return await resumeRepository.DeleteAsync(resumeId);
        }

    }
}
