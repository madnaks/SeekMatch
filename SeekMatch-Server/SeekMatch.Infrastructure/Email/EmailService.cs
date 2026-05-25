using Microsoft.Extensions.Configuration;
using Resend;
using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _fromEmail;
        private readonly IResend _resend;

        public EmailService(IConfiguration configuration)
        {
            _fromEmail = configuration["RESEND:FROM_EMAIL"]
                 ?? throw new InvalidOperationException("RESEND:FROM_EMAIL is not configured.");

            var apiKey = configuration["RESEND:API_KEY"]
                ?? throw new InvalidOperationException("RESEND:API_KEY is not configured.");
            _resend = ResendClient.Create(apiKey);

        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var resp = await _resend.EmailSendAsync(new EmailMessage()
            {
                From = _fromEmail,
                To = "med.haouam@gmail.com", // replace it by //to h
                Subject = subject,
                HtmlBody = body,
            });
        }

        public async Task SendExpressApplicationConfirmationAsync(ExpressApplication expressApplication, JobOffer jobOffer)
        {
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Email", "Templates", "ExpressApplicationConfirmation.html");
            var html = await File.ReadAllTextAsync(templatePath);

            html = html.Replace("{{FirstName}}", expressApplication.FirstName)
                       .Replace("{{LastName}}", expressApplication.LastName)
                       .Replace("{{JobTitle}}", jobOffer.Title)
                       .Replace("{{DateSubmitted}}", DateTime.UtcNow.ToString("MMMM dd, yyyy"));

            var subject = "Your job application has been received!";
            await SendEmailAsync(expressApplication.Email, subject, html);
        }

        public async Task SendExpressApplicationRejectionAsync(JobApplication jobApplication)
        {
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Email", "Templates", "ExpressApplicationRejection.html");
            var html = await File.ReadAllTextAsync(templatePath);

            if (jobApplication.ExpressApplication != null)
            {
                html = html.Replace("{{FirstName}}", jobApplication.ExpressApplication.FirstName)
                           .Replace("{{LastName}}", jobApplication.ExpressApplication.LastName)
                           .Replace("{{JobTitle}}", jobApplication.JobOffer?.Title)
                           .Replace("{{DateSubmitted}}", DateTime.UtcNow.ToString("MMMM dd, yyyy"));


                var subject = "Your job application has been rejected!";
                await SendEmailAsync(jobApplication.ExpressApplication.Email, subject, html);
            }

        }

        public async Task SendCompanyRecruterCreationAsync(Recruiter recruiter, string temporaryPassword)
        {
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Email", "Templates", "CompanyRecruterCreation.html");
            var html = await File.ReadAllTextAsync(templatePath);

            if (recruiter != null)
            {
                html = html.Replace("{{FirstName}}", recruiter.FirstName)
                           .Replace("{{LastName}}", recruiter.LastName)
                           .Replace("{{Email}}", recruiter.User.Email)
                           .Replace("{{TemporaryPassword}}", temporaryPassword);


                var subject = "Your Recruiter Account Is Ready – Temporary Password Inside";
                await SendEmailAsync(recruiter.User.Email!, subject, html);
            }

        }

        public async Task SendTalentAccountCreationAsync(Talent talent)
        {
            var templatePath = Path.Combine(AppContext.BaseDirectory, "Email", "Templates", "TalentAccountCreation.html");
            var html = await File.ReadAllTextAsync(templatePath);

            if (talent != null)
            {
                html = html.Replace("{{FirstName}}", talent.FirstName)
                           .Replace("{{LastName}}", talent.LastName)
                           .Replace("{{ActivationUrl", "api/activation");

                var subject = "Your Talent Account Is Ready";
                await SendEmailAsync(talent.User.Email!, subject, html);
            }

        }

    }
}
