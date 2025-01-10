using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IRecruiterService
    {
        Task<IdentityResult> RegisterAsync(RegisterRecruiterDto registerRecruiterDto);
        Task<RecruiterDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
    }
}
