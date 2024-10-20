﻿using SeekMatch.Application.DTOs;
using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface ITalentService
    {
        Task CreateAsync(Talent talent);
        Task<TalentDto?> GetAsync(string userId);
        Task<bool> SaveAboutYouAsync(AboutYouDto aboutYouDto, string userId);
    }
}
