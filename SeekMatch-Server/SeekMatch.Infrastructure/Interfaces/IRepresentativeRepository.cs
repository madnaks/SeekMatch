using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IRepresentativeRepository
    {
        Task RegisterAsync(Representative representative);
        Task<Representative?> GetAsync(string userId);
        Task<bool> SaveChangesAsync(Representative representative);
    }
}
