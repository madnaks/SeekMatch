using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Representative;

namespace SeekMatch.Application.Interfaces
{
    public interface IRepresentativeService
    {
        Task<IdentityResult> RegisterAsync(RegisterRepresentativeDto registerRepresentativeDto);
        Task<RepresentativeDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
    }
}
