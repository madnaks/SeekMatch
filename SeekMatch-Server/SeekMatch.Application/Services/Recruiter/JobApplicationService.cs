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

        public async Task<IList<JobApplicationDto>?> GetAllByTalentAsync(string talentId)
        {
            return _mapper.Map<IList<JobApplicationDto>>(await _jobApplicationRepository.GetAllByTalentAsync(talentId));
        }

        public async Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync()
        {
            return _mapper.Map<IList<JobApplicationDto>>(await _jobApplicationRepository.GetAllByRecruiterAsync());
        }

        public async Task<bool> ApplyAsync(string talentId, string jobOfferId)
        {
            // Check if the talent has already applied for the job offer
            var existingApplication = await _jobApplicationRepository
                .FindByTalentAndJobOfferAsync(talentId, jobOfferId);

            if (existingApplication != null)
            {
                throw new Exception("You have already applied for this job offer.");
            }

            var jobApplication = new JobApplication() { 
                Id = Guid.NewGuid().ToString(),
                AppliedAt = DateTime.UtcNow,
                JobOfferId = jobOfferId,
                TalentId = talentId
            };
            return await _jobApplicationRepository.ApplyAsync(jobApplication);
        }

        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            return await _jobApplicationRepository.DeleteAsync(jobApplicationId);
        }

    }
}
