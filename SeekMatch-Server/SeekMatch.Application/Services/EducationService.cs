﻿using AutoMapper;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class EducationService : IEducationService
    {
        private readonly IEducationRepository _educationRepository;
        private readonly IMapper _mapper;

        public EducationService(IEducationRepository educationRepository, IMapper mapper)
        {
            _educationRepository = educationRepository;
            _mapper = mapper;
        }

        public async Task<IList<EducationDto>?> GetAllAsync(string talentId)
        {
            return _mapper.Map<IList<EducationDto>>(await _educationRepository.GetAllAsync(talentId));
        }

        public async Task<bool> CreateAsync(EducationDto educationDto, string talentId)
        {
            var education = _mapper.Map<Education>(educationDto);
            education.TalentId = talentId;
            return await _educationRepository.CreateAsync(education);
        }

    }
}
