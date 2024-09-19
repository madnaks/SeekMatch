using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace SeekMatch.Infrastructure
{
    public class SeekMatchDbContextFactory : IDesignTimeDbContextFactory<SeekMatchDbContext>
    {
        public SeekMatchDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../SeekMatch"))
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<SeekMatchDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new SeekMatchDbContext(optionsBuilder.Options);
        }
    }
}
