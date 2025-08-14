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
        private readonly IJobOfferRepository _jobOfferRepository;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;

        public JobApplicationService(
            IJobApplicationRepository jobApplicationRepository,
            IJobOfferRepository jobOfferRepository,
            IEmailService emailService,
            INotificationService notificationService, 
            IMapper mapper)
        {
            _jobApplicationRepository = jobApplicationRepository;
            _jobOfferRepository = jobOfferRepository;
            _emailService = emailService;
            _notificationService = notificationService;
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

        public async Task<bool> ExpressApplyAsync(ExpressApplicationDto expressApplicationDto, string jobOfferId)
        {
            var expressApplication = _mapper.Map<ExpressApplication>(expressApplicationDto);

            // Check if the anonymous talent has already applied for the job offer
            var existingApplication = await _jobApplicationRepository
                .FindByEmailAndExpressApplicationAsync(expressApplication.Email, jobOfferId);

            if (existingApplication != null)
            {
                throw new Exception("You have already applied for this job offer with this email.");
            }

            var existingJobOffer = await _jobOfferRepository.GetByIdAsync(jobOfferId);

            if (existingJobOffer == null)
            {
                throw new Exception("Job offer not found");
            }

            var jobApplication = new JobApplication()
            {
                Id = Guid.NewGuid().ToString(),
                AppliedAt = DateTime.UtcNow,
                JobOfferId = jobOfferId,
                Email = expressApplication.Email,
                IsExpress = true
            };

            await _emailService.SendExpressApplicationConfirmationAsync(expressApplication, existingJobOffer);

            return await _jobApplicationRepository.ApplyAsync(jobApplication);
        }

        public async Task<bool> RejectAsync(string jobApplicationId, string rejectionReason)
        {
            var result = await _jobApplicationRepository.RejectAsync(jobApplicationId, rejectionReason);
            
            var existingJobOffer = await _jobApplicationRepository.GetByIdAsync(jobApplicationId);

            if (existingJobOffer != null) {
                if (existingJobOffer.IsExpress)
                {
                    await _emailService.SendExpressApplicationRejectionAsync(existingJobOffer, existingJobOffer);
                }
                else
                {
                    await _notificationService.CreateNotificationAsync(existingJobOffer.TalentId, rejectionReason);
                }
            }

            return result;
        }

        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            return await _jobApplicationRepository.DeleteAsync(jobApplicationId);
        }
    }
}
