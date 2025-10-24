using SeekMatch.Application.DTOs.Talent;

namespace SeekMatch.Application.Interfaces
{
    public interface IResumeService
    {
        Task<IList<ResumeDto>?> GetAllAsync(string talentId);
        Task<FileDownloadResult> DownloadResume(string resumeId);
        Task<bool> CreateAsync(ResumeDto resumeDto, string talentId);
        Task<bool> UpdateAsync(ResumeDto resumeDto);
        Task<bool> DeleteAsync(string resumeId);
    }
}
