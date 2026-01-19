using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendExpressApplicationConfirmationAsync(ExpressApplication expressApplication, JobOffer jobOffer);
        Task SendExpressApplicationRejectionAsync(JobApplication jobApplication);
        Task SendCompanyRecruterCreationAsync(Recruiter recruiter, string temporaryPassword);
    }
}
