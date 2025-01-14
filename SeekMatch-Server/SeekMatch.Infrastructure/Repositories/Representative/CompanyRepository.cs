﻿using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public CompanyRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Company?> GetAsync(string id)
        {
            try
            {
                return await _dbContext.Companies
                    .FirstOrDefaultAsync(t => t.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the company", ex);
            }
        }

        public async Task CreateAsync(Company company)
        {
            _dbContext.Companies.Add(company);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(Company company)
        {
            try
            {
                _dbContext.Companies.Update(company);

                var result = await _dbContext.SaveChangesAsync(true);

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving changes of the company", ex);
            }
        }
    }
}
