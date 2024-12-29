using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IRepresentativeRepository
    {
        Task CreateAsync(Representative representative);
    }
}
