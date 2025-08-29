using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class JobOfferRepository(SeekMatchDbContext dbContext) : IJobOfferRepository
    {
        public async Task<IList<JobOffer>?> GetAllAsync(JobOfferFilter filters)
        {
            try
            {
                var query = dbContext.JobOffers.AsQueryable();

                if (!string.IsNullOrWhiteSpace(filters.Title))
                    query = query.Where(j => j.Title.Contains(filters.Title));

                if (!string.IsNullOrWhiteSpace(filters.CompanyName)) 
                    query = query.Where(j => j.CompanyName != null && j.CompanyName.Contains(filters.CompanyName));

                if (filters.Type != null && filters.Type != 0)
                    query = query.Where(j => j.Type == filters.Type);

                if (filters.WorkplaceType != null && filters.WorkplaceType != 0)
                    query = query.Where(j => j.WorkplaceType == filters.WorkplaceType);

                return await query
                    .Where(j => j.IsActive)
                    .OrderBy(e => e.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job offer", ex);
            }
        }
        
        public async Task<IList<JobOffer>?> GetAllByRecruiterAsync(string recruiterId)
        {
            try
            {
                return await dbContext.JobOffers
                    .Where(e => e.RecruiterId == recruiterId)
                    .Include(e => e.JobApplications)
                        .ThenInclude(t => t.Talent)
                    .Include(e => e.JobApplications)
                        .ThenInclude(ex => ex.ExpressApplication)
                    .OrderBy(e => e.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job offer", ex);
            }
        }

        public async Task<JobOffer?> GetByIdAsync(string id)
        {
            try
            {
                return await dbContext.JobOffers.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the job offer", ex);
            }
        }

        public async Task<bool> CreateAsync(JobOffer jobOffer)
        {
            try
            {
                dbContext.JobOffers.Add(jobOffer);
                var result = await dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the job offer", ex);
            }
        }

        public async Task<bool> UpdateAsync(JobOffer jobOffer)
        {
            try
            {
                dbContext.JobOffers.Attach(jobOffer);

                dbContext.Entry(jobOffer).State = EntityState.Modified;

                var result = await dbContext.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the job offer", ex);
            }
        }

        public async Task<bool> DeleteAsync(string jobOfferId)
        {
            try
            {
                var jobOffer = await dbContext.JobOffers.FindAsync(jobOfferId);
                if (jobOffer != null)
                {
                    dbContext.JobOffers.Remove(jobOffer);
                    var result = await dbContext.SaveChangesAsync();
                    return result > 0;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the job offer", ex);
            }
        }
    }
}
