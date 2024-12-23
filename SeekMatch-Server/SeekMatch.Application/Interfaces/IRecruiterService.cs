using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface IRecruiterService
    {
        Task CreateAsync(Recruiter recruiter);
    }
}
