using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class ExperienceService(IExperienceRepository experienceRepository, IMapper mapper) : IExperienceService
    {
        public async Task<IList<ExperienceDto>?> GetAllAsync(string talentId)
        {
            return mapper.Map<IList<ExperienceDto>>(await experienceRepository.GetAllAsync(talentId));
        }

        public async Task<bool> CreateAsync(ExperienceDto experienceDto, string talentId)
        {
            var experience = mapper.Map<Experience>(experienceDto);
            experience.Id = Guid.NewGuid().ToString();
            experience.TalentId = talentId;
            return await experienceRepository.CreateAsync(experience);
        }

        public async Task<bool> UpdateAsync(ExperienceDto experienceDto)
        {
            if (experienceDto != null && !string.IsNullOrEmpty(experienceDto.Id))
            {
                var existingExperience = await experienceRepository.GetByIdAsync(experienceDto.Id);
                if (existingExperience == null)
                {
                    throw new Exception("Experience not found");
                }

                mapper.Map(experienceDto, existingExperience);

                return await experienceRepository.UpdateAsync(existingExperience);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string experienceId)
        {
            return await experienceRepository.DeleteAsync(experienceId);
        }

    }
}
