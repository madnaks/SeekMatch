using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class EducationService(IEducationRepository educationRepository, IMapper mapper) : IEducationService
    {
        public async Task<IList<EducationDto>?> GetAllAsync(string talentId) => 
            mapper.Map<IList<EducationDto>>(await educationRepository.GetAllAsync(talentId));

        public async Task<bool> CreateAsync(EducationDto educationDto, string talentId)
        {
            var education = mapper.Map<Education>(educationDto);
            education.Id = Guid.NewGuid().ToString();
            education.TalentId = talentId;
            return await educationRepository.CreateAsync(education);
        }

        public async Task<bool> UpdateAsync(EducationDto educationDto)
        {
            if (educationDto != null && !string.IsNullOrEmpty(educationDto.Id))
            {
                var existingEducation = await educationRepository.GetByIdAsync(educationDto.Id);
                if (existingEducation == null)
                    throw new Exception("Education not found");

                mapper.Map(educationDto, existingEducation);

                return await educationRepository.UpdateAsync(existingEducation);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string educationId) => await educationRepository.DeleteAsync(educationId);
    }
}
