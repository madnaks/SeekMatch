using AutoMapper;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        public CompanyService(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<CompanyDto?> GetAsync(string id)
        {
            return _mapper.Map<CompanyDto>(await _companyRepository.GetAsync(id));
        }

        public async Task CreateAsync(Company company)
        {
            await _companyRepository.CreateAsync(company);
        }

        public async Task<bool> UpdateAsync(CompanyDto companyDto, string id)
        {
            var company = await _companyRepository.GetAsync(id);

            if (company != null)
            {
                company.Name = companyDto.Name;
                company.PhoneNumber = companyDto.PhoneNumber;
                company.Address = companyDto.Address;

                return await _companyRepository.UpdateAsync(company);
            }

            return false;
        }
    }
}
