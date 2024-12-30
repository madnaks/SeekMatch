using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface IRecruiterService
    {
        Task CreateAsync(Recruiter recruiter);
        Task<RecruiterDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);
        Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId);
        Task<bool> DeleteProfilePictureAsync(string userId);
    }
}
