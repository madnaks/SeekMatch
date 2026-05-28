using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.DTOs.Representative;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;
using System.Net;
using AboutYouDto = SeekMatch.Application.DTOs.Representative.AboutYouDto;

namespace SeekMatch.Application.Services
{
    public class RepresentativeService(
            IRepresentativeRepository representativeRepository,
            ISettingRepository settingRepository,
            IMapper mapper,
            ICompanyService companyService,
            UserManager<User> userManager,
            IEmailService emailService) : IRepresentativeService
    {
        public async Task<IdentityResult> RegisterAsync(RegisterRepresentativeDto registerRepresentativeDto, string activationUrlBase)
        {
            var user = new User
            {
                UserName = registerRepresentativeDto.Email,
                Email = registerRepresentativeDto.Email,
                Role = UserRole.Representative
            };

            var result = await userManager.CreateAsync(user, registerRepresentativeDto.Password);
            if (!result.Succeeded)
                return result;

            var company = new Company()
            {
                Name = registerRepresentativeDto.CompanyName,
                Address = registerRepresentativeDto.CompanyAddress,
                Region = registerRepresentativeDto.CompanyRegion,
                City = registerRepresentativeDto.CompanyCity,
                Phone = registerRepresentativeDto.CompanyPhone,
                Website = registerRepresentativeDto.CompanyWebsite
            };
            await companyService.CreateAsync(company);

            var representative = new Representative()
            {
                FirstName = registerRepresentativeDto.FirstName,
                LastName = registerRepresentativeDto.LastName,
                Position = registerRepresentativeDto.Position,
                Company = company,
                CompanyId = company.Id,
                User = user
            };

            var setting = new Setting()
            {
                User = user,
                Language = registerRepresentativeDto.Setting?.Language
            };

            await settingRepository.CreateAsync(setting);

            await representativeRepository.RegisterAsync(representative);

            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var activationUrl = BuildActivationUrl(activationUrlBase, user.Id, token);

            await emailService.SendRepresentativeAccountCreationAsync(representative, activationUrl);

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
            if (user == null || user.Role != UserRole.Representative)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Representative account was not found."
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

        public async Task<RepresentativeDto?> GetAsync(string userId) => mapper.Map<RepresentativeDto>(await representativeRepository.GetAsync(userId));

        public async Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId)
        {
            var representative = await representativeRepository.GetAsync(userId);
            if (representative != null)
            {
                representative.FirstName = aboutYouDto.FirstName;
                representative.LastName = aboutYouDto.LastName;

                return await representativeRepository.UpdateAsync(representative);
            }

            return false;
        }

        #region Profile picture management
        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var representative = await representativeRepository.GetAsync(userId);
            if (representative == null)
                return false;

            representative.ProfilePicture = profilePictureData;
            await representativeRepository.UpdateAsync(representative);

            return true;
        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var representative = await representativeRepository.GetAsync(userId);
            if (representative == null)
                return false;

            representative.ProfilePicture = null;
            await representativeRepository.UpdateAsync(representative);

            return true;
        }
        #endregion

        #region Company Recruiter Management
        public async Task<List<RecruiterDto>> GetAllRecruitersAsync(string userId)
        {
            var representative = await representativeRepository.GetAsync(userId);
            
            if (representative != null)
            {
                var recruiters = representative.Company.Recruiters;
                return mapper.Map<List<RecruiterDto>>(recruiters);
            }

            return new List<RecruiterDto>();
        }
        #endregion

        private static string BuildActivationUrl(string activationUrlBase, string userId, string token)
        {
            var separator = activationUrlBase.Contains('?') ? '&' : '?';

            return $"{activationUrlBase}{separator}userId={WebUtility.UrlEncode(userId)}&token={WebUtility.UrlEncode(token)}";
        }
    }
}
