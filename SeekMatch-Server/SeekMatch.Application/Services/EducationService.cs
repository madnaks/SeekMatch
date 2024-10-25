using AutoMapper;
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

        public async Task<bool> CreateAsync(CreateEducationDto createEducationDto, string talentId)
        {
            var education = _mapper.Map<Education>(createEducationDto);
            education.TalentId = talentId;
            return await _educationRepository.CreateAsync(education);
        }

        public async Task<bool> UpdateAsync(EducationDto educationDto)
        {
            if (educationDto != null && !string.IsNullOrEmpty(educationDto.Id))
            {
                var existingEducation = await _educationRepository.GetByIdAsync(educationDto.Id);
                if (existingEducation == null)
                {
                    throw new Exception("Education not found");
                }

                _mapper.Map(educationDto, existingEducation);

                return await _educationRepository.UpdateAsync(existingEducation);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string educationId)
        {
            return await _educationRepository.DeleteAsync(educationId);
        }

    }
}
