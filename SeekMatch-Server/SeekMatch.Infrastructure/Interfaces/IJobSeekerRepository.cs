using SeekMatch.Core.Entities;

namespace SeekMatch.Core.Interfaces
{
    public interface IJobSeekerRepository
    {
        Task CreateAsync(JobSeeker jobSeeker);
    }
}
