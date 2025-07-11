﻿using SeekMatch.Core.Entities;

namespace SeekMatch.Application.DTOs.Talent
{
    public class TalentDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ProfileTitle { get; set; }
        public string? Summary { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Phone { get; set; }
        public string? Country { get; set; }
        public int? Region { get; set; }
        public int? City { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? LinkedIn { get; set; }
        public byte[]? ProfilePicture { get; set; }
        public List<EducationDto> Educations { get; set; } = new List<EducationDto>();
        public List<ExperienceDto> Experiences { get; set; } = new List<ExperienceDto>();
    }
}
