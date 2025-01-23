using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IJobApplicationRepository _jobApplicationRepository;
        private readonly IMapper _mapper;

        public JobApplicationService(IJobApplicationRepository jobApplicationRepository, IMapper mapper)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _mapper = mapper;
        }

        public async Task<IList<JobApplicationDto>?> GetAllByTalentAsync()
        {
            return _mapper.Map<IList<JobApplicationDto>>(await _jobApplicationRepository.GetAllByTalentAsync());
        }

        public async Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync()
        {
            return _mapper.Map<IList<JobApplicationDto>>(await _jobApplicationRepository.GetAllByRecruiterAsync());
        }

        public async Task<bool> CreateAsync(string talentId, string jobOfferId)
        {
            var jobApplication = new JobApplication() { 
                Id = Guid.NewGuid().ToString(),
                JobOfferId = jobOfferId,
                TalentId = talentId
            };
            return await _jobApplicationRepository.CreateAsync(jobApplication);
        }

        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            return await _jobApplicationRepository.DeleteAsync(jobApplicationId);
        }

    }
}
