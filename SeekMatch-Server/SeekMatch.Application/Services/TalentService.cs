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
    }
}
