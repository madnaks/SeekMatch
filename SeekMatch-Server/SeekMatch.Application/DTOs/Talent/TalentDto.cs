using SeekMatch.Core.Entities;

namespace SeekMatch.Application.DTOs.Talent
{
    public class TalentDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ProfileTitle { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
        public string? Email { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public List<EducationDto> Educations { get; set; } = new List<EducationDto>();
        public List<ExperienceDto> Experiences { get; set; } = new List<ExperienceDto>();
    }
}
