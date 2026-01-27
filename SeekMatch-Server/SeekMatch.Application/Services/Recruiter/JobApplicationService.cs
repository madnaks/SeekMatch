using AutoMapper;
using SeekMatch.Application.DTOs.Recruiter;
using SeekMatch.Application.Interfaces;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using System.Net;

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
        public async Task<IList<JobApplicationDto>?> GetAllByTalentAsync(string talentId) => 
            mapper.Map<IList<JobApplicationDto>>(await jobApplicationRepository.GetAllByTalentAsync(talentId));

        public async Task<IList<JobApplicationDto>?> GetAllByRecruiterAsync() =>
            mapper.Map<IList<JobApplicationDto>>(await jobApplicationRepository.GetAllByRecruiterAsync());

        public async Task<bool> ApplyAsync(string talentId, string jobOfferId)
        {
            // Check if the talent has already applied for the job offer
            var existingApplication = await jobApplicationRepository
                .FindByTalentAndJobOfferAsync(talentId, jobOfferId);

            if (existingApplication != null)
                throw new Exception("You have already applied for this job offer.");

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
                throw new Exception("You have already applied for this job offer with this email.");

            var existingJobOffer = await jobOfferRepository.GetByIdAsync(jobOfferId);
            if (existingJobOffer == null)
                throw new Exception("Job offer not found");

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
            expressApplication.FilePath = cvPath;

            await emailService.SendExpressApplicationConfirmationAsync(expressApplication, existingJobOffer);

            return await jobApplicationRepository.ExpressApplyAsync(jobApplication, expressApplication);
        }

        public async Task<bool> ShortList(string jobApplicationId) => 
            await jobApplicationRepository.ShortList(jobApplicationId);

        public async Task<bool> InterviewScheduled(string jobApplicationId, InterviewScheduleDto interviewScheduleDto) => 
            await jobApplicationRepository.InterviewScheduled(jobApplicationId, interviewScheduleDto.Platform, interviewScheduleDto.Date);
        
        public async Task<bool> Hire(string jobApplicationId) => 
            await jobApplicationRepository.Hire(jobApplicationId);

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

        public async Task<ServiceResult<FileDownloadResult>> DownloadResume(string jobApplicationId)
        {
            var jobApplication = await jobApplicationRepository.GetByIdWithTalentDetailsAsync(jobApplicationId);

            if (jobApplication == null) 
                return ServiceResult<FileDownloadResult>.Fail(HttpStatusCode.NotFound, "Job application not found");

            string? filePath = null;

            if (jobApplication.IsExpress && jobApplication.ExpressApplication != null)
            {
                filePath = jobApplication.ExpressApplication.FilePath;
            }
            else
            {
                filePath = jobApplication.Talent?.Resumes?.FirstOrDefault(r => r.IsPrimary)?.FilePath;
            }

            if (string.IsNullOrEmpty(filePath))
                return ServiceResult<FileDownloadResult>.Fail(
                    HttpStatusCode.NotFound,
                    "This talent has no resume uploaded"
                );

            try
            {
                var stream = await fileStorageService.OpenReadAsync(filePath);
                var fileName = Path.GetFileName(filePath);

                return ServiceResult<FileDownloadResult>.Ok(
                    new FileDownloadResult(stream, fileName, "application/pdf")
                );
            }
            catch (Exception ex)
            {
                return ServiceResult<FileDownloadResult>.Fail(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public async Task<bool> DeleteAsync(string jobApplicationId) => 
            await jobApplicationRepository.DeleteAsync(jobApplicationId);
    }
}
