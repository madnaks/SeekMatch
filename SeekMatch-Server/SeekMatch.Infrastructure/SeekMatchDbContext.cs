using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure
{
    public class SeekMatchDbContext : IdentityDbContext<User>
    {
        public DbSet<Talent> Talents { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }
        public DbSet<JobOffer> JobOffers { get; set; }
        public DbSet<Representative> Representatives { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ExpressApplication> ExpressApplications { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Bookmark> Bookmarks { get; set; }

        public SeekMatchDbContext(DbContextOptions<SeekMatchDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Talent)
                .WithOne(t => t.User)
                .HasForeignKey<Talent>(t => t.Id);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Recruiter)
                .WithOne(r => r.User)
                .HasForeignKey<Recruiter>(r => r.Id);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Representative)
                .WithOne(r => r.User)
                .HasForeignKey<Representative>(r => r.Id);

            modelBuilder.Entity<Education>()
                .HasOne(e => e.Talent)
                .WithMany(t => t.Educations)
                .HasForeignKey(e => e.TalentId);

            modelBuilder.Entity<Experience>()
                .HasOne(e => e.Talent)
                .WithMany(t => t.Experiences)
                .HasForeignKey(e => e.TalentId);

            modelBuilder.Entity<Representative>()
                .HasOne(r => r.Company)
                .WithMany(c => c.Representatives)
                .HasForeignKey(r => r.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Recruiter>()
                .HasOne(r => r.Company)
                .WithMany(c => c.Recruiters)
                .HasForeignKey(r => r.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<JobOffer>()
                .HasOne(j => j.Recruiter)
                .WithMany(r => r.JobOffers)
                .HasForeignKey(j => j.RecruiterId)
                .IsRequired();

            modelBuilder.Entity<JobApplication>()
                .HasOne(j => j.Talent)
                .WithMany(t => t.JobApplications)
                .HasForeignKey(j => j.TalentId);

            modelBuilder.Entity<JobApplication>()
                .HasOne(j => j.JobOffer)
                .WithMany(o => o.JobApplications)
                .HasForeignKey(j => j.JobOfferId);

            modelBuilder.Entity<JobApplication>()
                .HasOne(j => j.ExpressApplication)
                .WithOne(e => e.JobApplication)
                .HasForeignKey<ExpressApplication>(e => e.JobApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.user)
                .WithMany()
                .HasForeignKey(n => n.userId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Resume>()
               .HasOne(e => e.Talent)
               .WithMany(t => t.Resumes)
               .HasForeignKey(e => e.TalentId);

            modelBuilder.Entity<Bookmark>(entity =>
            {
                entity.HasKey(b => b.Id);

                entity.HasOne(b => b.JobOffer)
                      .WithMany(j => j.Bookmarks) 
                      .HasForeignKey(b => b.JobOfferId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(b => b.Talent)
                      .WithMany(t => t.Bookmarks) 
                      .HasForeignKey(b => b.TalentId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(b => new { b.TalentId, b.JobOfferId })
                      .IsUnique();
            });


            modelBuilder.Entity<Setting>(entity =>
            {
                entity.HasKey(s => s.UserId);

                entity.HasOne(s => s.User)
                      .WithOne()
                      .HasForeignKey<Setting>(s => s.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}
