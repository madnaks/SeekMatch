using SeekMatch.Application.DTOs;

namespace SeekMatch.Application.Interfaces
{
    public interface IEducationService
    {
        Task<IList<EducationDto>?> GetAllAsync(string talentId);
        Task<bool> CreateAsync(EducationDto educationDto, string talentId);
    }
}
