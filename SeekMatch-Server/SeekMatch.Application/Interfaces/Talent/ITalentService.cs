using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface ITalentService
    {
        Task<IdentityResult> RegisterAsync(RegisterTalentDto registerTalentDto, string activationUrlBase);
        Task<IdentityResult> ActivateAccountAsync(string userId, string token);
        Task<TalentDto?> GetAsync(string userId);
        Task<bool> SaveProfileAsync(TalentDto talentDto, string userId);
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
        Task<IList<BookmarkDto>?> GetAllBookmarksAsync(string userId);
    }
}
