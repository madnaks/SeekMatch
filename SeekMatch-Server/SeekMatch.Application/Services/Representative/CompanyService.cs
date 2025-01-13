using AutoMapper;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

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
    }
}
