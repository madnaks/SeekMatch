using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IRepresentativeRepository
    {
        Task CreateAsync(Representative representative);
        Task<Representative?> GetAsync(string userId);
        Task<bool> SaveChangesAsync(Representative representative);
    }
}
