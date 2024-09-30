using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface IJobSeekerService
    {
        Task CreateAsync(JobSeeker jobSeeker);
    }
}
