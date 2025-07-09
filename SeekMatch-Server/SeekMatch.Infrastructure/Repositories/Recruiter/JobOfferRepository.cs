using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class JobOfferRepository : IJobOfferRepository
    {
        public readonly SeekMatchDbContext _dbContext;
        public JobOfferRepository(SeekMatchDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IList<JobOffer>?> GetAllAsync(JobOfferFilter filters)
        {
            try
            {
                var query = _dbContext.JobOffers.AsQueryable();

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
                return await _dbContext.JobOffers
                    .Where(e => e.RecruiterId == recruiterId)
                    .Include(e => e.JobApplications)
                    .ThenInclude(t => t.Talent)
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
                return await _dbContext.JobOffers.FindAsync(id);
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
                _dbContext.JobOffers.Add(jobOffer);
                var result = await _dbContext.SaveChangesAsync();

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
                _dbContext.JobOffers.Attach(jobOffer);

                _dbContext.Entry(jobOffer).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();

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
                var jobOffer = await _dbContext.JobOffers.FindAsync(jobOfferId);
                if (jobOffer != null)
                {
                    _dbContext.JobOffers.Remove(jobOffer);
                    var result = await _dbContext.SaveChangesAsync();
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
