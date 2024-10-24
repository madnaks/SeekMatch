using SeekMatch.Application.DTOs;

namespace SeekMatch.Application.Interfaces
{
    public interface IEducationService
    {
        Task<IList<EducationDto>?> GetAllAsync(string talentId);
        Task<bool> CreateAsync(CreateEducationDto createEducationDto, string talentId);
        Task<bool> DeleteAsync(string educationId);
    }
}
