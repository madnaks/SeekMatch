using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;
using System.Net;

namespace SeekMatch.Application.Services
{
    public class TalentService(
            ITalentRepository talentRepository,
            ISettingRepository settingRepository,
            IMapper mapper,
            UserManager<User> userManager,
            IEmailService emailService) : ITalentService
    {
        public async Task<IdentityResult> RegisterAsync(RegisterTalentDto registerTalentDto, string activationUrlBase)
        {
            var user = new User
            {
                UserName = registerTalentDto.Email,
                Email = registerTalentDto.Email,
                Role = UserRole.Talent
            };

            var result = await userManager.CreateAsync(user, registerTalentDto.Password);
            if (!result.Succeeded)
                return result;

            var talent = new Talent()
            {
                FirstName = registerTalentDto.FirstName,
                LastName = registerTalentDto.LastName,
                User = user
            };

            var setting = new Setting()
            {
                User = user,
                Language = registerTalentDto.Setting?.Language
            };

            await settingRepository.CreateAsync(setting);

            await talentRepository.CreateAsync(talent);

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var activationUrl = BuildActivationUrl(activationUrlBase, user.Id, token);

            await emailService.SendTalentAccountCreationAsync(talent, activationUrl);

            return IdentityResult.Success;
        } 

        public async Task<IdentityResult> ActivateAccountAsync(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Activation link is invalid."
                });
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null || user.Role != UserRole.Talent)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Talent account was not found."
                });
            }

            if (user.EmailConfirmed)
                return IdentityResult.Success;

            var confirmResult = await userManager.ConfirmEmailAsync(user, token);
            if (!confirmResult.Succeeded)
                return confirmResult;

            user.EmailConfirmed = true;
            user.UpdatedAt = DateTime.UtcNow;

            return await userManager.UpdateAsync(user);
        }
        
        public async Task<TalentDto?> GetAsync(string userId) => 
            mapper.Map<TalentDto>(await talentRepository.GetAsync(userId));
        
        public async Task<bool> SaveProfileAsync(TalentDto talentDto, string userId)
        {
            var talent = await talentRepository.GetAsync(userId);

            if (talent != null)
            {
                talent.FirstName = talentDto.FirstName ?? "";
                talent.LastName = talentDto.LastName ?? "";
                talent.ProfileTitle = talentDto.ProfileTitle;
                talent.Summary = talentDto.Summary;
                talent.DateOfBirth = talentDto.DateOfBirth;
                talent.Phone = talentDto.Phone;
                talent.Country = talentDto.Country;
                talent.Region = talentDto.Region;
                talent.City = talentDto.City;
                talent.LinkedIn = talentDto.LinkedIn;
                talent.Website = talentDto.Website;

                return await talentRepository.SaveChangesAsync(talent);
            }

            return false;
        }

        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var talent = await talentRepository.GetAsync(userId);
            if (talent == null)
                return false;

            talent.ProfilePicture = profilePictureData;
            await talentRepository.SaveChangesAsync(talent);

            return true;

        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var talent = await talentRepository.GetAsync(userId);
            if (talent == null)
                return false;

            talent.ProfilePicture = null;
            await talentRepository.SaveChangesAsync(talent);

            return true;
        }

        public async Task<IList<BookmarkDto>?> GetAllBookmarksAsync(string userId)
        {
            var bookmarks = await talentRepository.GetBookmarks(userId);

            return bookmarks != null ? mapper.Map<IList<BookmarkDto>>(bookmarks) : null;
        }

        private static string BuildActivationUrl(string activationUrlBase, string userId, string token)
        {
            var separator = activationUrlBase.Contains('?') ? '&' : '?';

            return $"{activationUrlBase}{separator}userId={WebUtility.UrlEncode(userId)}&token={WebUtility.UrlEncode(token)}";
        }

    }
}
