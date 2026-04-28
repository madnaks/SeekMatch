using SeekMatch.Core.Entities;

namespace SeekMatch.Infrastructure.Interfaces
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
    }
}
