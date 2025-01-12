using SeekMatch.Application.DTOs.Talent;

namespace SeekMatch.Application.Interfaces
{
    public interface IEducationService
    {
        Task<IList<EducationDto>?> GetAllAsync(string talentId);
        Task<bool> CreateAsync(EducationDto educationDto, string talentId);
        Task<bool> UpdateAsync(EducationDto educationDto);
        Task<bool> DeleteAsync(string educationId);
    }
}
