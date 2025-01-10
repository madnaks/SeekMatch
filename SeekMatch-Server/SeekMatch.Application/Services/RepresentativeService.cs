using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class RepresentativeService : IRepresentativeService
    {
        private readonly IRepresentativeRepository _representativeRepository;
        private readonly IMapper _mapper;
        private readonly ICompanyService _companyService;
        private readonly UserManager<User> _userManager;

        public RepresentativeService(
            IRepresentativeRepository representativeRepository, 
            IMapper mapper,
            ICompanyService companyService,
            UserManager<User> userManager)
        {
            _representativeRepository = representativeRepository;
            _mapper = mapper;
            _companyService = companyService;
            _userManager = userManager;
        }

        public async Task<IdentityResult> RegisterAsync(RegisterRepresentativeDto registerRepresentativeDto)
        {
            var user = new User
            {
                UserName = registerRepresentativeDto.Email,
                Email = registerRepresentativeDto.Email,
                Role = UserRole.Representative
            };

            var result = await _userManager.CreateAsync(user, registerRepresentativeDto.Password);

            if (!result.Succeeded)
                return result;

            var company = new Company()
            {
                Name = registerRepresentativeDto.CompanyName,
                Address = registerRepresentativeDto.CompanyAddress,
                PhoneNumber = registerRepresentativeDto.CompanyPhoneNumber
            };

            await _companyService.CreateAsync(company);

            var representative = new Representative()
            {
                FirstName = registerRepresentativeDto.FirstName,
                LastName = registerRepresentativeDto.LastName,
                Position = registerRepresentativeDto.Position,
                Company = company,
                CompanyId = company.Id,
                User = user
            };

            await _representativeRepository.RegisterAsync(representative);

            return IdentityResult.Success;
        }

        public async Task<RepresentativeDto?> GetAsync(string userId)
        {
            return _mapper.Map<RepresentativeDto>(await _representativeRepository.GetAsync(userId));
        }

        public async Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId)
        {
            var representative = await _representativeRepository.GetAsync(userId);

            if (representative != null)
            {
                representative.FirstName = aboutYouDto.FirstName;
                representative.LastName = aboutYouDto.LastName;

                return await _representativeRepository.SaveChangesAsync(representative);
            }

            return false;
        }

        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var representative = await _representativeRepository.GetAsync(userId);

            if (representative == null)
            {
                return false;
            }

            representative.ProfilePicture = profilePictureData;
            await _representativeRepository.SaveChangesAsync(representative);

            return true;
        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var representative = await _representativeRepository.GetAsync(userId);

            if (representative == null)
            {
                return false;
            }

            representative.ProfilePicture = null;
            await _representativeRepository.SaveChangesAsync(representative);

            return true;
        }
    }
}
