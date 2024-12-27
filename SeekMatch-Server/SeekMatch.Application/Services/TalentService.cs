using AutoMapper;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class TalentService : ITalentService
    {
        private readonly ITalentRepository _talentRepository;
        private readonly IMapper _mapper;
        public TalentService(ITalentRepository talentRepository, IMapper mapper)
        {
            _talentRepository = talentRepository;
            _mapper = mapper;
        }
        public async Task CreateAsync(Talent talent)
        {
            await _talentRepository.CreateAsync(talent);
        } 
        
        public async Task<TalentDto?> GetAsync(string userId)
        {
            return _mapper.Map<TalentDto>(await _talentRepository.GetAsync(userId));
        } 
        
        public async Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent != null)
            {
                talent.FirstName = aboutYouDto.FirstName;
                talent.LastName = aboutYouDto.LastName;
                talent.ProfileTitle = aboutYouDto.ProfileTitle;
                talent.DateOfBirth = aboutYouDto.DateOfBirth;
                talent.Address = aboutYouDto.Address;
                talent.Phone = aboutYouDto.Phone;
                talent.City = aboutYouDto.City;
                talent.State = aboutYouDto.State;
                talent.Zip = aboutYouDto.Zip;

                return await _talentRepository.SaveChangesAsync(talent);
            }

            return false;
        }

        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent == null)
            {
                return false;
            }

            talent.ProfilePicture = profilePictureData;
            await _talentRepository.SaveChangesAsync(talent);

            return true;

        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent == null)
            {
                return false;
            }

            talent.ProfilePicture = null;
            await _talentRepository.SaveChangesAsync(talent);

            return true;
        }
    }
}
