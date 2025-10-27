namespace SeekMatch.Infrastructure.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(Stream fileStream, string fileName);
        Task<Stream> OpenReadAsync(string relativePath);
        Task<bool> ExistsAsync(string relativePath);
        Task<bool> DeleteFileAsync(string relativePath);
    }
}
