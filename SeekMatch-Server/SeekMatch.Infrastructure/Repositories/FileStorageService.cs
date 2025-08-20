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
            {
                Directory.CreateDirectory(_uploadsFolder);
            }
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
    }
}
