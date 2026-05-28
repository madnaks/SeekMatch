using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;
using System.Net;

namespace SeekMatch.Application.Services
{
    public class RecruiterService(
            IRecruiterRepository recruiterRepository,
            ISettingRepository settingRepository,
            IEmailService emailService,
            IMapper mapper,
            UserManager<User> userManager) : IRecruiterService
    {
        public async Task<IdentityResult> RegisterAsync(RegisterRecruiterDto registerRecruiterDto, string activationUrlBase)
        {
            var user = new User
            {
                UserName = registerRecruiterDto.Email,
                Email = registerRecruiterDto.Email,
                Role = UserRole.Recruiter
            };

            var result = await userManager.CreateAsync(user, registerRecruiterDto.Password);
            if (!result.Succeeded)
                return result;

            var recruiter = new Recruiter()
            {
                FirstName = registerRecruiterDto.FirstName,
                LastName = registerRecruiterDto.LastName,
                IsFreelancer = true,
                User = user
            };

            var setting = new Setting()
            {
                User = user,
                Language = registerRecruiterDto.Setting?.Language
            };

            await settingRepository.CreateAsync(setting);

            await recruiterRepository.CreateAsync(recruiter);

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var activationUrl = BuildActivationUrl(activationUrlBase, user.Id, token);

            await emailService.SendRecruiterAccountCreationAsync(recruiter, activationUrl);

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
            if (user == null || user.Role != UserRole.Recruiter)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Recruiter account was not found."
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

        public async Task<RecruiterDto?> GetAsync(string userId) => mapper.Map<RecruiterDto>(await recruiterRepository.GetAsync(userId));

        public async Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId)
        {
            var recruiter = await recruiterRepository.GetAsync(userId);
            if (recruiter != null)
            {
                recruiter.FirstName = aboutYouDto.FirstName;
                recruiter.LastName = aboutYouDto.LastName;

                return await recruiterRepository.SaveChangesAsync(recruiter);
            }

            return false;
        }

        #region Profile picture management
        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var recruiter = await recruiterRepository.GetAsync(userId);
            if (recruiter == null)
                return false;

            recruiter.ProfilePicture = profilePictureData;
            await recruiterRepository.SaveChangesAsync(recruiter);

            return true;
        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var recruiter = await recruiterRepository.GetAsync(userId);
            if (recruiter == null)
                return false;

            recruiter.ProfilePicture = null;
            await recruiterRepository.SaveChangesAsync(recruiter);

            return true;
        }
        #endregion

        #region Company Recruiter Management
        public async Task<IdentityResult> CreateAsync(RecruiterDto recruiterDto, string companyId)
        {
            var user = new User
            {
                UserName = recruiterDto.Email,
                Email = recruiterDto.Email,
                Role = UserRole.CompanyRecruiter,
                IsTemporaryPassword = true
            };

            var temporaryPassword = Utils.GenerateTemporaryPassword();

            var result = await userManager.CreateAsync(user, temporaryPassword);
            if (!result.Succeeded)
                return result;

            var recruiter = new Recruiter()
            {
                FirstName = recruiterDto.FirstName,
                LastName = recruiterDto.LastName,
                CompanyId = companyId,
                User = user
            };

            await recruiterRepository.CreateAsync(recruiter);

            await emailService.SendCompanyRecruterCreationAsync(recruiter, temporaryPassword);

            return IdentityResult.Success;
        }

        public async Task<bool> UpdateAsync(RecruiterDto recruiterDto, string companyId)
        {

            if (recruiterDto != null && !string.IsNullOrEmpty(recruiterDto.Id))
            {
                var existingRecruiter = await recruiterRepository.GetAsync(recruiterDto.Id);
                if (existingRecruiter == null)
                    throw new Exception("Recruiter not found");

                mapper.Map(recruiterDto, existingRecruiter);
                return await recruiterRepository.UpdateAsync(existingRecruiter);
            }

            return false;

        }
        #endregion

        private static string BuildActivationUrl(string activationUrlBase, string userId, string token)
        {
            var separator = activationUrlBase.Contains('?') ? '&' : '?';

            return $"{activationUrlBase}{separator}userId={WebUtility.UrlEncode(userId)}&token={WebUtility.UrlEncode(token)}";
        }

    }
}
