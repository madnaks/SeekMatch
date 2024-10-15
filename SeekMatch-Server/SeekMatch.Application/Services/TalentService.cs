using Microsoft.EntityFrameworkCore;
using SeekMatch.Application.DTOs;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Interfaces;

namespace SeekMatch.Application.Services
{
    public class TalentService : ITalentService
    {
        private readonly ITalentRepository _talentRepository;
        public TalentService(ITalentRepository talentRepository)
        {
            _talentRepository = talentRepository;
        }
        public async Task CreateAsync(Talent talent)
        {
            await _talentRepository.CreateAsync(talent);
        } 
        
        public async Task<Talent?> GetAsync(string userId)
        {
            return await _talentRepository.GetAsync(userId);
        } 
        
        public async Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent != null)
            {
                // Update existing profile
                talent.FirstName = aboutYouDto.FirstName;
                talent.LastName = aboutYouDto.LastName;
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
    }
}
