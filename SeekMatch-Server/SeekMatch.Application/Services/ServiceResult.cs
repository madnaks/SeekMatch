using System.Net;

namespace SeekMatch.Application.Services
{
    public class ServiceResult<T>
    {
        public bool Success { get; init; }
        public string? Message { get; init; }
        public HttpStatusCode StatusCode { get; init; }
        public T? Value { get; init; }

        public static ServiceResult<T> Ok(T value)
            => new() { 
                Success = true, 
                Value = value 
            };

        public static ServiceResult<T> Fail(HttpStatusCode status, string message)
            => new() { 
                Success = false, 
                StatusCode = status, 
                Message = message 
            };

    }
}
