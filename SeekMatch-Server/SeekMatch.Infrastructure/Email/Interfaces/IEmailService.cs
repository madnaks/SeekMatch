using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendExpressApplicationConfirmationAsync(ExpressApplication expressApplication, JobOffer jobOffer);
        Task SendExpressApplicationRejectionAsync(ExpressApplication expressApplication, JobOffer jobOffer);
    }
}
