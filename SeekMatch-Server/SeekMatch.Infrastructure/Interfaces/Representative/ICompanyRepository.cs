using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface ICompanyRepository
    {
        Task CreateAsync(Company company);
    }
}
