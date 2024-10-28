using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure
{
    public class SeekMatchDbContext : IdentityDbContext<User>
    {
        public DbSet<Talent> Talents { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Experience> Experiences { get; set; }

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

            modelBuilder.Entity<Education>()
                .HasOne(e => e.Talent)
                .WithMany(t => t.Educations)
                .HasForeignKey(e => e.TalentId);

            modelBuilder.Entity<Experience>()
                .HasOne(e => e.Talent)
                .WithMany(t => t.Experiences)
                .HasForeignKey(e => e.TalentId);

        }
    }
}
