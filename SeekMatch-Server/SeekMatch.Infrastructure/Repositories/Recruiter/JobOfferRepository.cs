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

        public async Task<IList<JobOffer>?> GetAllByCompanyAsync(string companyId)
        {
            try
            {
                return await dbContext.JobOffers
                    .Where(e => e.Recruiter.CompanyId == companyId)
                    .Include(e => e.JobApplications)
                        .ThenInclude(t => t.Talent)
                    .Include(e => e.JobApplications)
                        .ThenInclude(ex => ex.ExpressApplication)
                    .Include(e => e.Recruiter)
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
                return await dbContext.JobOffers
                    .Include(j => j.JobApplications)
                        .ThenInclude(ja => ja.Talent)
                    .Include(e => e.JobApplications)
                        .ThenInclude(ex => ex.ExpressApplication)
                    .FirstOrDefaultAsync(j => j.Id == id);
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

        public async Task<bool> IsBookmarkedAsync(string jobOfferId, string talentId)
        {
            var result = await dbContext.Bookmarks
                    .Where(e => e.JobOfferId == jobOfferId && e.TalentId == talentId)
                    .ToListAsync();
            return result.Count() > 0;
        }

        public async Task<bool> BookmarkAsync(Bookmark bookmark)
        {
            try
            {
                var jobOfferExists = await dbContext.JobOffers.AnyAsync(j => j.Id == bookmark.JobOfferId);
                var talentExists = await dbContext.Talents.AnyAsync(t => t.Id == bookmark.TalentId);

                if (!jobOfferExists || !talentExists)
                {
                    throw new InvalidOperationException("Either the job offer or talent does not exist.");
                }

                dbContext.Bookmarks.Add(bookmark);
                return await dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving the bookmark", ex);
            }
        } 
        
        public async Task<bool> UnBookmarkAsync(Bookmark bookmark)
        {
            try
            {
                var existingBookmark = await dbContext.Bookmarks.FirstOrDefaultAsync(b => b.TalentId == bookmark.TalentId && b.JobOfferId == bookmark.JobOfferId);

                if (existingBookmark == null)
                {
                    return false;
                }

                dbContext.Bookmarks.Remove(existingBookmark);
                return await dbContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while saving the bookmark", ex);
            }
        }
    }
}
