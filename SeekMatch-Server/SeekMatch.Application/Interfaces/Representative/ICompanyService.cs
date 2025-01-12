using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface ICompanyService
    {
        Task CreateAsync(Company company);
    }
}
