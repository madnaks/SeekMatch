using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.DTOs.Representative;
using AboutYouDto = SeekMatch.Application.DTOs.Representative.AboutYouDto;

namespace SeekMatch.Application.Interfaces
{
    public interface IRepresentativeService
    {
        Task<IdentityResult> RegisterAsync(RegisterRepresentativeDto registerRepresentativeDto);
        Task<RepresentativeDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);

        #region Profile picture management
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
        #endregion

        Task<List<RecruiterDto>> GetAllRecruitersAsync(string userId);

    }
}
