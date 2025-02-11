using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Talent;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class TalentService : ITalentService
    {
        private readonly ITalentRepository _talentRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public TalentService(
            ITalentRepository talentRepository, 
            IMapper mapper,
            UserManager<User> userManager)
        {
            _talentRepository = talentRepository;
            _mapper = mapper;
            _userManager = userManager;
        }
        public async Task<IdentityResult> RegisterAsync(RegisterTalentDto registerTalentDto)
        {
            var user = new User
            {
                UserName = registerTalentDto.Email,
                Email = registerTalentDto.Email,
                Role = UserRole.Talent
            };

            var result = await _userManager.CreateAsync(user, registerTalentDto.Password);

            if (!result.Succeeded)
                return result;

            //await _userManager.AddToRoleAsync(user, model.Role.ToString());

            var talent = new Talent()
            {
                FirstName = registerTalentDto.FirstName,
                LastName = registerTalentDto.LastName,
                User = user
            };

            await _talentRepository.CreateAsync(talent);

            return IdentityResult.Success;
        } 
        
        public async Task<TalentDto?> GetAsync(string userId)
        {
            return _mapper.Map<TalentDto>(await _talentRepository.GetAsync(userId));
        } 
        
        public async Task<bool> SaveAboutYouAsync(ProfileDto profileDto, string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent != null)
            {
                talent.FirstName = profileDto.FirstName;
                talent.LastName = profileDto.LastName;
                talent.ProfileTitle = profileDto.ProfileTitle;
                talent.DateOfBirth = profileDto.DateOfBirth;
                talent.Address = profileDto.Address;
                talent.Phone = profileDto.Phone;
                talent.City = profileDto.City;
                talent.State = profileDto.State;
                talent.Zip = profileDto.Zip;

                return await _talentRepository.SaveChangesAsync(talent);
            }

            return false;
        }

        public async Task<bool> UpdateProfilePictureAsync(byte[] profilePictureData, string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent == null)
            {
                return false;
            }

            talent.ProfilePicture = profilePictureData;
            await _talentRepository.SaveChangesAsync(talent);

            return true;

        }

        public async Task<bool> DeleteProfilePictureAsync(string userId)
        {
            var talent = await _talentRepository.GetAsync(userId);

            if (talent == null)
            {
                return false;
            }

            talent.ProfilePicture = null;
            await _talentRepository.SaveChangesAsync(talent);

            return true;
        }
    }
}
