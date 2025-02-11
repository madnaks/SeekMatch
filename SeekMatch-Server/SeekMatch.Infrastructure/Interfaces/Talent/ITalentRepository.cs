﻿using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface ITalentRepository
    {
        Task CreateAsync(Talent talent);
        Task<Talent?> GetAsync(string userId);
        Task<bool> SaveChangesAsync(Talent talent);
    }
}
