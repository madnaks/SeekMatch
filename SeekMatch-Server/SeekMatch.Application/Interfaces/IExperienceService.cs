using SeekMatch.Application.DTOs;

namespace SeekMatch.Application.Interfaces
{
    public interface IExperienceService
    {
        Task<IList<ExperienceDto>?> GetAllAsync(string talentId);
        Task<bool> CreateAsync(CreateExperienceDto createExperienceDto, string talentId);
        Task<bool> UpdateAsync(ExperienceDto experienceDto);
        Task<bool> DeleteAsync(string experienceId);
    }
}
