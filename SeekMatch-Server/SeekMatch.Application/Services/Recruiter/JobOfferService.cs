using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using SeekMatch.Infrastructure.Repositories;

namespace SeekMatch.Application.Services
{
    public class JobOfferService(IJobOfferRepository jobOfferRepository, IMapper mapper) : IJobOfferService
    {
        public async Task<IList<JobOfferDto>?> GetAllAsync(JobOfferFilterDto filters)
        {
            var jobOfferFilters = mapper.Map<JobOfferFilter>(filters);
            return mapper.Map<IList<JobOfferDto>>(await jobOfferRepository.GetAllAsync(jobOfferFilters));
        }

        public async Task<IList<JobOfferDto>?> GetAllByRecruiterAsync(string recruiterId)
        {
            return mapper.Map<IList<JobOfferDto>>(await jobOfferRepository.GetAllByRecruiterAsync(recruiterId));
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
                {
                    throw new Exception("Job offer not found");
                }

                mapper.Map(jobOfferDto, existingJobOffer);

                return await jobOfferRepository.UpdateAsync(existingJobOffer);
            }

            return false;
        }

        public async Task<bool> DeleteAsync(string jobOfferId)
        {
            return await jobOfferRepository.DeleteAsync(jobOfferId);
        }

        public async Task<bool> IsBookmarkedAsync(string jobOfferId, string talentId)
        {
            return await jobOfferRepository.IsBookmarkedAsync(jobOfferId, talentId);
        }

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
