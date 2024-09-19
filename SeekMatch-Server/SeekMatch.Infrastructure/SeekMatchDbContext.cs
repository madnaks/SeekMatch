using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure
{
    public class SeekMatchDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<JobSeeker> JobSeekers { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }

        public SeekMatchDbContext(DbContextOptions<SeekMatchDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.JobSeeker)
                .WithOne(js => js.User)
                .HasForeignKey<JobSeeker>(js => js.Id);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Recruiter)
                .WithOne(r => r.User)
                .HasForeignKey<Recruiter>(r => r.Id);
        }
    }
}
