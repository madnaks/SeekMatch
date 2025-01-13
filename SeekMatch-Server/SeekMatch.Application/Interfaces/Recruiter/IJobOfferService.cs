﻿using SeekMatch.Application.DTOs.Recruiter;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobOfferService
    {
        Task<IList<JobOfferDto>?> GetAllAsync(string jobOfferId);
        Task<bool> CreateAsync(JobOfferDto jobOfferDto, string recruiterId);
        Task<bool> UpdateAsync(JobOfferDto jobOfferDto);
        Task<bool> DeleteAsync(string jobOfferId);
    }
}