using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Enums;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class JobOfferService(
        IJobOfferRepository jobOfferRepository, 
        IMapper mapper,
        UserManager<User> userManager,
        IRepresentativeService representativeService,
        IRecruiterService recruiterService) : IJobOfferService
    {
        public async Task<IList<JobOfferDto>?> GetAllAsync(JobOfferFilterDto filters)
        {
            var jobOfferFilters = mapper.Map<JobOfferFilter>(filters);
            return mapper.Map<IList<JobOfferDto>>(await jobOfferRepository.GetAllAsync(jobOfferFilters));
        }

        public async Task<JobOfferDto?> GetByIdAsync(string jobOfferId) => 
            mapper.Map<JobOfferDto>(await jobOfferRepository.GetByIdAsync(jobOfferId));

        public async Task<IList<JobOfferDto>?> GetAllByRecruiterAsync(string recruiterId) => 
            mapper.Map<IList<JobOfferDto>>(await jobOfferRepository.GetAllByRecruiterAsync(recruiterId));

        public async Task<IList<JobOfferDto>?> GetAllByCompanyAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            var companyId = string.Empty;

            if (user != null && user.Role == UserRole.Representative)
            {
                var representativeDto = await representativeService.GetAsync(userId);

                if (representativeDto == null)
                    return null;

                companyId = representativeDto.CompanyId;
            }

            if (user != null && user.Role == UserRole.Recruiter)
            {
                var recruiterDto = await recruiterService.GetAsync(userId);

                if (recruiterDto == null)
                    return null;

                companyId = recruiterDto.CompanyId;
            }

            if (string.IsNullOrEmpty(companyId))
                return null;

            return mapper.Map<IList<JobOfferDto>>(await jobOfferRepository.GetAllByCompanyAsync(companyId));
        }

        public async Task<bool> CreateAsync(JobOfferDto jobOfferDto, string recruiterId)
        {
            var jobOffer = mapper.Map<JobOffer>(jobOfferDto);
            jobOffer.Id = Guid.NewGuid().ToString();
            jobOffer.RecruiterId = recruiterId;
            return await jobOfferRepository.CreateAsync(jobOffer);
        }

        public async Task<bool> UpdateAsync(JobOfferDto jobOfferDto)
        {
            if (jobOfferDto != null && !string.IsNullOrEmpty(jobOfferDto.Id))
            {
                var existingJobOffer = await jobOfferRepository.GetByIdAsync(jobOfferDto.Id);
                if (existingJobOffer == null)
                    throw new Exception("Job offer not found");

                mapper.Map(jobOfferDto, existingJobOffer);

                return await jobOfferRepository.UpdateAsync(existingJobOffer);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string jobOfferId) => await jobOfferRepository.DeleteAsync(jobOfferId);

        public async Task<bool> IsBookmarkedAsync(string jobOfferId, string talentId) => await jobOfferRepository.IsBookmarkedAsync(jobOfferId, talentId);

        public async Task<bool> BookmarkAsync(string jobOfferId, string talentId)
        {
            var bookmark = new Bookmark()
            {
                TalentId = talentId,
                JobOfferId = jobOfferId
            };
            return await jobOfferRepository.BookmarkAsync(bookmark);
        }
        
        public async Task<bool> UnBookmarkAsync(string jobOfferId, string talentId)
        {
            var bookmark = new Bookmark()
            {
                TalentId = talentId,
                JobOfferId = jobOfferId
            };
            return await jobOfferRepository.UnBookmarkAsync(bookmark);
        }

    }
}
