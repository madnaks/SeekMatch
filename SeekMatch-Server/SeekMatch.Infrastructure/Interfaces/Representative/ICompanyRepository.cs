using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface ICompanyRepository
    {
        Task<Company?> GetAsync(string id);
        Task CreateAsync(Company company);
    }
}
