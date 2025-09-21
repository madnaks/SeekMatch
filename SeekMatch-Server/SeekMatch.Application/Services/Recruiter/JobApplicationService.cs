using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
 
namespace SeekMatch.Application.Services
{
    public class JobApplicationService(
            IJobApplicationRepository jobApplicationRepository,
            IJobOfferRepository jobOfferRepository,
            IEmailService emailService,
            IFileStorageService fileStorageService,
            INotificationService notificationService,
            IMapper mapper) : IJobApplicationService
    {
        public async Task<IList<JobApplicationDto>?> GetAllByTalentAsync(string talentId)
        {
            return mapper.Map<IList<JobApplicationDto>>(await jobApplicationRepository.GetAllByTalentAsync(talentId));
        }

        public async Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync()
        {
            return mapper.Map<IList<JobApplicationDto>>(await jobApplicationRepository.GetAllByRecruiterAsync());
        }

        public async Task<bool> ApplyAsync(string talentId, string jobOfferId)
        {
            // Check if the talent has already applied for the job offer
            var existingApplication = await jobApplicationRepository
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
            return await jobApplicationRepository.ApplyAsync(jobApplication);
        }

        public async Task<bool> ExpressApplyAsync(ExpressApplicationDto expressApplicationDto, string jobOfferId, Stream cvStream, string fileName)
        {
            var expressApplication = mapper.Map<ExpressApplication>(expressApplicationDto);

            // Check if the anonymous talent has already applied for the job offer
            var existingApplication = await jobApplicationRepository
                .FindByEmailAndExpressApplicationAsync(expressApplication.Email, jobOfferId);

            if (existingApplication != null)
            {
                throw new Exception("You have already applied for this job offer with this email.");
            }

            var existingJobOffer = await jobOfferRepository.GetByIdAsync(jobOfferId);

            if (existingJobOffer == null)
            {
                throw new Exception("Job offer not found");
            }

            var jobApplication = new JobApplication()
            {
                Id = Guid.NewGuid().ToString(),
                AppliedAt = DateTime.UtcNow,
                JobOfferId = jobOfferId,
                IsExpress = true
            };

            var newExpressApplicationGuid = Guid.NewGuid().ToString();

            expressApplication.Id = newExpressApplicationGuid;
            expressApplication.JobApplicationId = jobApplication.Id;

            var cvPath = await fileStorageService.SaveFileAsync(cvStream, $"{newExpressApplicationGuid}_{fileName}");
            expressApplication.CvPath = cvPath;

            await emailService.SendExpressApplicationConfirmationAsync(expressApplication, existingJobOffer);

            return await jobApplicationRepository.ExpressApplyAsync(jobApplication, expressApplication);
        }

        public async Task<bool> ShortList(string jobApplicationId)
        {
            var result = await jobApplicationRepository.ShortList(jobApplicationId);
            
            return result;
        }
        
        public async Task<bool> RejectAsync(string jobApplicationId, string rejectionReason)
        {
            var result = await jobApplicationRepository.RejectAsync(jobApplicationId, rejectionReason);
            
            var existingJobApplication = await jobApplicationRepository.GetByIdAsync(jobApplicationId);

            if (existingJobApplication != null) {
                if (existingJobApplication.IsExpress)
                {
                    await emailService.SendExpressApplicationRejectionAsync(existingJobApplication);
                }
                else
                {
                    await notificationService.CreateNotificationAsync(existingJobApplication.TalentId!, rejectionReason);
                }
            }

            return result;
        }

        public async Task<FileDownloadResult> DownloadCv(string jobApplicationId)
        {
            var jobApplication = await jobApplicationRepository.GetByIdAsync(jobApplicationId);

            if (jobApplication == null)
            {
                throw new Exception("Job application not found");
            }

            if (jobApplication.IsExpress) {
                if (jobApplication.ExpressApplication == null || jobApplication.ExpressApplication.CvPath == null)
                {
                    throw new Exception("CV not found for this express application");
                }

                var stream = await fileStorageService.OpenReadAsync(jobApplication.ExpressApplication.CvPath);
                var fileName = Path.GetFileName(jobApplication.ExpressApplication.CvPath);

                return new FileDownloadResult(stream, fileName, "application/pdf");

            }

            // TODO: handle non-express job applications if needed
            throw new Exception("CV download not supported for non-express applications yet");
        }

        public async Task<bool> DeleteAsync(string jobApplicationId)
        {
            return await jobApplicationRepository.DeleteAsync(jobApplicationId);
        }

    }
}
