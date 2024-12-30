using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IRecruiterRepository _recruiterRepository;
        private readonly IMapper _mapper;
        public RecruiterService(IRecruiterRepository recruiterRepository, IMapper mapper)
        {
            _recruiterRepository = recruiterRepository;
            _mapper = mapper;
        }
        public async Task CreateAsync(Recruiter recruiter)
        {
            await _recruiterRepository.CreateAsync(recruiter);
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
