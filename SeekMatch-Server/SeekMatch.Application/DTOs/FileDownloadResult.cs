public class FileDownloadResult(Stream fileStream, string fileName, string contentType)
{
    public Stream FileStream { get; } = fileStream;
    public string FileName { get; } = fileName;
    public string ContentType { get; } = contentType;
}
