﻿using SeekMatch.Core.Enums;

namespace SeekMatch.Application.DTOs.Recruiter
{
    public class JobApplicationDto
    {
        public string? Id { get; set; }
        public DateOnly? AppliedAt { get; set; }
    }
}
