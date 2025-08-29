using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class CompanyRepository(SeekMatchDbContext dbContext) : ICompanyRepository
    {
        public async Task<Company?> GetAsync(string id)
        {
            try
            {
                return await dbContext.Companies
                    .FirstOrDefaultAsync(t => t.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the company", ex);
            }
        }

        public async Task CreateAsync(Company company)
        {
            dbContext.Companies.Add(company);
            await dbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(Company company)
        {
            try
            {
                dbContext.Companies.Update(company);

                var result = await dbContext.SaveChangesAsync(true);

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving changes of the company", ex);
            }
        }
    }
}
