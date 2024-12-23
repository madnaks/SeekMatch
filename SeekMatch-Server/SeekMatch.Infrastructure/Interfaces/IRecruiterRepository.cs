using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IRecruiterRepository
    {
        Task CreateAsync(Recruiter recruiter);
    }
}
