using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IRecruiterService
    {
        Task<IdentityResult> RegisterAsync(RegisterRecruiterDto registerRecruiterDto);
        Task<RecruiterDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);

        #region Profile picture management
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
        #endregion

        #region Company Recruiter Management
        Task<IdentityResult> CreateAsync(RecruiterDto recruiterDto, string companyId);
        Task<bool> UpdateAsync(RecruiterDto recruiterDto, string companyId);
        #endregion
    }
}
