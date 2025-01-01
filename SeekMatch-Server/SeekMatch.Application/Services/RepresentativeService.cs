using AutoMapper;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Application.Services
{
    public class RepresentativeService : IRepresentativeService
    {
        private readonly IRepresentativeRepository _representativeRepository;
        private readonly IMapper _mapper;
        public RepresentativeService(IRepresentativeRepository representativeRepository, IMapper mapper)
        {
            _representativeRepository = representativeRepository;
            _mapper = mapper;
        }
        public async Task CreateAsync(Representative representative)
        {
            await _representativeRepository.CreateAsync(representative);
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
