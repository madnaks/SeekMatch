using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface IRepresentativeService
    {
        Task CreateAsync(Representative representative);
        Task<RepresentativeDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
    }
}
