using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Core.Interfaces;

namespace SeekMatch.Application.Services
{
    public class JobSeekerService : IJobSeekerService
    {
        private readonly IJobSeekerRepository _jobSeekerRepository;
        public JobSeekerService(IJobSeekerRepository jobSeekerRepository)
        {
            _jobSeekerRepository = jobSeekerRepository;
        }
        public async Task CreateAsync(JobSeeker jobSeeker)
        {
            await _jobSeekerRepository.CreateAsync(jobSeeker);
        }
    }
}
