using SeekMatch.Core.Entities;
using SeekMatch.Core.Interfaces;
using SeekMatch.Infrastructure;

namespace SeekMatch.Core.Repositories
{
    public class TalentRepository : ITalentRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public TalentRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Talent talent)
        {
            _dbContext.Talents.Add(talent);
            await _dbContext.SaveChangesAsync();
        }
    }
}
