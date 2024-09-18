using Microsoft.EntityFrameworkCore;
using SeekMatch_Core.Entities;

namespace SeekMatch_Infrastructure
{
    public class SeekMatchDbContext : DbContext
    {
        public SeekMatchDbContext(DbContextOptions<SeekMatchDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<JobSeeker> JobSeekers { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }

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

            // Default value configuration for CreatedAt and UpdatedAt in BaseEntity
            modelBuilder.Entity<BaseEntity>()
                .Property(b => b.CreatedAt)
                .HasDefaultValueSql("getutcdate()");

            modelBuilder.Entity<BaseEntity>()
                .Property(b => b.UpdatedAt)
                .HasDefaultValueSql("getutcdate()");
        }

    }
}
