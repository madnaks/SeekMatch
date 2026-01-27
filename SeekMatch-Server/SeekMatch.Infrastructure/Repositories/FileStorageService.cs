using SeekMatch.Infrastructure.Interfaces;

namespace SeekMatch.Infrastructure.Repositories
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _uploadsFolder;

        public FileStorageService(string uploadsFolder)
        {
            _uploadsFolder = uploadsFolder;
            if (!Directory.Exists(_uploadsFolder))
                Directory.CreateDirectory(_uploadsFolder);
        }

        public async Task<string> SaveFileAsync(Stream fileStream, string fileName)
        {
            var filePath = Path.Combine(_uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(stream);
            }

            // Return relative path for DB
            return $"/uploads/{fileName}";
        }

        public Task<bool> ExistsAsync(string relativePath)
        {
            var fullPath = GetFullPath(relativePath);
            var exists = File.Exists(fullPath);
            return Task.FromResult(exists);
        }

        public Task<Stream> OpenReadAsync(string relativePath)
        {
            var fullPath = GetFullPath(relativePath);

            if (!File.Exists(fullPath))
                throw new FileNotFoundException("File not found.", fullPath);

            // Open with read/share read so MVC can stream it safely
            Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return Task.FromResult(stream);
        }

        public async Task<bool> DeleteFileAsync(string relativePath)
        {
            try
            {
                var fullPath = GetFullPath(relativePath);

                if (File.Exists(fullPath))
                {
                    await Task.Run(() => File.Delete(fullPath));
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting file: {relativePath}", ex);
            }
        }

        private string GetFullPath(string relativePath)
        {
            // Normalize input like "/uploads/xyz.pdf" → "xyz.pdf"
            var fileNameOnly = Path.GetFileName(relativePath);

            // Prevent traversal by ensuring we only ever combine the file name
            return Path.Combine(_uploadsFolder, fileNameOnly);
        }
    }
}
