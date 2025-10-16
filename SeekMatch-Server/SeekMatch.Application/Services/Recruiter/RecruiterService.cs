﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class RecruiterService(
            IRecruiterRepository recruiterRepository,
            ISettingRepository settingRepository,
            IEmailService emailService,
            IMapper mapper,
            UserManager<User> userManager) : IRecruiterService
    {
        public async Task<IdentityResult> RegisterAsync(RegisterRecruiterDto registerRecruiterDto)
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

            return IdentityResult.Success;
        }
        public async Task<RecruiterDto?> GetAsync(string userId)
        {
            return mapper.Map<RecruiterDto>(await recruiterRepository.GetAsync(userId));
        }
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
            {
                return false;
            }

            recruiter.ProfilePicture = profilePictureData;
            await recruiterRepository.SaveChangesAsync(recruiter);

            return true;
        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var recruiter = await recruiterRepository.GetAsync(userId);

            if (recruiter == null)
            {
                return false;
            }

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
                Role = UserRole.Recruiter
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

            var subject = "Your Temporary Password";
            var body = $"Hello { recruiter.FirstName } { recruiter.LastName },<br/>" +
                       $"Your account has been created. Here is your temporary password: <strong>{ temporaryPassword }</strong><br/>" +
                       "Please change it after logging in.";

            await emailService.SendEmailAsync(recruiterDto.Email, subject, body);


            return IdentityResult.Success;
        }
        #endregion

    }
}
