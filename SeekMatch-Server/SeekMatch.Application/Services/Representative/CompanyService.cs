using AutoMapper;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class CompanyService(ICompanyRepository companyRepository, IMapper mapper) : ICompanyService
    {
        public async Task<CompanyDto?> GetAsync(string id)
        {
            return mapper.Map<CompanyDto>(await companyRepository.GetAsync(id));
        }

        public async Task CreateAsync(Company company)
        {
            await companyRepository.CreateAsync(company);
        }

        public async Task<bool> UpdateAsync(CompanyDto companyDto, string id)
        {
            var company = await companyRepository.GetAsync(id);

            if (company != null)
            {
                company.Name = companyDto.Name;
                company.PhoneNumber = companyDto.PhoneNumber;
                company.Address = companyDto.Address;

                return await companyRepository.UpdateAsync(company);
            }

            return false;
        }
    }
}
