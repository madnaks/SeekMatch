using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using SeekMatch.Infrastructure.Repositories;

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
                .FindByEmailAndExpressApplicationAsync(expressApplicationDto.Email, jobOfferId);

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
                Email = expressApplicationDto.Email,
                IsExpress = true
            };

            // TODO : Change YourCompanyName
            var subject = "Your job application has been received!";
            var body = $@"
                        <html>
                          <body style='font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;'>
                            <div style='max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);'>
                              <h2 style='color: #2c3e50;'>Hello {expressApplicationDto.FirstName} {expressApplicationDto.LastName},</h2>

                              <p>We’re happy to let you know that your application for the position of 
                                <strong style='color: #2980b9;'>{existingJobOffer.Title}</strong> 
                                has been successfully sent to the recruiter.</p>

                              <p>The recruiter will review your application and contact you directly if your profile matches the job requirements.</p>

                              <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />

                              <p style='font-size: 0.9em; color: #555;'>
                                <strong>Application Details:</strong><br/>
                                Name: {expressApplicationDto.FirstName} {expressApplicationDto.LastName}<br/>
                                Position: {existingJobOffer.Title}<br/>
                                Date Submitted: {DateTime.UtcNow:MMMM dd, yyyy}
                              </p>

                              <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />

                              <p style='margin-top: 15px;'>
                                📌 <strong>Tip:</strong> To better track this and future applications, 
                                <a href='SiteName/register' style='color: #2980b9; text-decoration: none; font-weight: bold;'>create a free account</a> 
                                on our website.
                              </p>

                              <p style='color: #777; font-size: 0.85em; margin-top: 20px;'>
                                — The YourCompanyName Team
                              </p>
                            </div>
                          </body>
                        </html>
                        ";


            await _emailService.SendEmailAsync(expressApplicationDto.Email, subject, body);

            return await _jobApplicationRepository.ApplyAsync(jobApplication);
        }

        public async Task<bool> RejectAsync(string jobApplicationId, string rejectionReason)
        {
            var result = await _jobApplicationRepository.RejectAsync(jobApplicationId, rejectionReason);
            
            var jobApplication = await _jobApplicationRepository.GetByIdAsync(jobApplicationId);
            if (jobApplication != null) {
                await _notificationService.CreateNotificationAsync(jobApplication.TalentId, rejectionReason);
            }

            return result;
        }

        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            return await _jobApplicationRepository.DeleteAsync(jobApplicationId);
        }
    }
}
