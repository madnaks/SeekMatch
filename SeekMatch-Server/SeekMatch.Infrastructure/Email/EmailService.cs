using SeekMatch.Core.Entities;
using SeekMatch.Infrastructure.Interfaces;
using System.Net;
using System.Net.Mail;

namespace SeekMatch.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _smtpHost = "smtp.gmail.com";
        private readonly int _smtpPort = 587;
        private readonly string _fromEmail = "med.haouam@gmail.com";
        private readonly string _appPassword = "hmmdrfqdrdobxrlw";

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail, "Your App Name"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(new MailAddress(to));

            using (var client = new SmtpClient(_smtpHost, _smtpPort))
            {
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(_fromEmail, _appPassword);
                await client.SendMailAsync(message);
            }
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

    }
}
