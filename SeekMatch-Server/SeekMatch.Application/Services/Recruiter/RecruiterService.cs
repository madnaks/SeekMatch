using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IRecruiterRepository _recruiterRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        public RecruiterService(
            IRecruiterRepository recruiterRepository, 
            IMapper mapper,
            UserManager<User> userManager)
        {
            _recruiterRepository = recruiterRepository;
            _mapper = mapper;
            _userManager = userManager;
        }
        public async Task<IdentityResult> RegisterAsync(RegisterRecruiterDto registerRecruiterDto)
        {
            var user = new User
            {
                UserName = registerRecruiterDto.Email,
                Email = registerRecruiterDto.Email,
                Role = UserRole.Recruiter
            };

            var result = await _userManager.CreateAsync(user, registerRecruiterDto.Password);
            
            if (!result.Succeeded)
                return result;

            var recruiter = new Recruiter()
            {
                FirstName = registerRecruiterDto.FirstName,
                LastName = registerRecruiterDto.LastName,
                IsFreelancer = true,
                User = user
            };

            await _recruiterRepository.CreateAsync(recruiter);

            return IdentityResult.Success;
        }
        public async Task<RecruiterDto?> GetAsync(string userId)
        {
            return _mapper.Map<RecruiterDto>(await _recruiterRepository.GetAsync(userId));
        }

        public async Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId)
        {
            var recruiter = await _recruiterRepository.GetAsync(userId);

            if (recruiter != null)
            {
                recruiter.FirstName = aboutYouDto.FirstName;
                recruiter.LastName = aboutYouDto.LastName;

                return await _recruiterRepository.SaveChangesAsync(recruiter);
            }

            return false;
        }

        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var recruiter = await _recruiterRepository.GetAsync(userId);

            if (recruiter == null)
            {
                return false;
            }

            recruiter.ProfilePicture = profilePictureData;
            await _recruiterRepository.SaveChangesAsync(recruiter);

            return true;
        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var recruiter = await _recruiterRepository.GetAsync(userId);

            if (recruiter == null)
            {
                return false;
            }

            recruiter.ProfilePicture = null;
            await _recruiterRepository.SaveChangesAsync(recruiter);

            return true;
        }
    }
}
