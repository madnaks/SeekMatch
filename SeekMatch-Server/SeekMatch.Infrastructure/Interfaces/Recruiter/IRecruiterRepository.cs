using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IRecruiterRepository
    {
        Task CreateAsync(Recruiter recruiter);
        Task<bool> UpdateAsync(Recruiter recruiter);
        Task<Recruiter?> GetAsync(string userId);
        Task<bool> SaveChangesAsync(Recruiter recruiter);
    }
}
