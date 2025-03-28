﻿using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class ExperienceService : IExperienceService
    {
        private readonly IExperienceRepository _experienceRepository;
        private readonly IMapper _mapper;

        public ExperienceService(IExperienceRepository experienceRepository, IMapper mapper)
        {
            _experienceRepository = experienceRepository;
            _mapper = mapper;
        }

        public async Task<IList<ExperienceDto>?> GetAllAsync(string talentId)
        {
            return _mapper.Map<IList<ExperienceDto>>(await _experienceRepository.GetAllAsync(talentId));
        }

        public async Task<bool> CreateAsync(ExperienceDto experienceDto, string talentId)
        {
            var experience = _mapper.Map<Experience>(experienceDto);
            experience.Id = Guid.NewGuid().ToString();
            experience.TalentId = talentId;
            return await _experienceRepository.CreateAsync(experience);
        }

        public async Task<bool> UpdateAsync(ExperienceDto experienceDto)
        {
            if (experienceDto != null && !string.IsNullOrEmpty(experienceDto.Id))
            {
                var existingExperience = await _experienceRepository.GetByIdAsync(experienceDto.Id);
                if (existingExperience == null)
                {
                    throw new Exception("Experience not found");
                }

                _mapper.Map(experienceDto, existingExperience);

                return await _experienceRepository.UpdateAsync(existingExperience);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string experienceId)
        {
            return await _experienceRepository.DeleteAsync(experienceId);
        }

    }
}
