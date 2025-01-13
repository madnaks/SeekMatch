using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface ICompanyService
    {
        Task<CompanyDto?> GetAsync(string id);
        Task CreateAsync(Company company);
    }
}
