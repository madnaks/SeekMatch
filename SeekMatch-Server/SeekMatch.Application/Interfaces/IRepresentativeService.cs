using SeekMatch.Core.Entities;

namespace SeekMatch.Application.Interfaces
{
    public interface IRepresentativeService
    {
        Task CreateAsync(Representative representative);
    }
}
