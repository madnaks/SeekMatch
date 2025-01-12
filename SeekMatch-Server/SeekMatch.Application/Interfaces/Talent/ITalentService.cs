using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Talent;

namespace SeekMatch.Application.Interfaces
{
    public interface ITalentService
    {
        Task<IdentityResult> RegisterAsync(RegisterTalentDto registerTalentDto);
        Task<TalentDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
    }
}
