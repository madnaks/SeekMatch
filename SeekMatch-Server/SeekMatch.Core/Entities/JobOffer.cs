﻿using SeekMatch.Core.Enums;

namespace SeekMatch.Core.Entities
{
    public class JobOffer : BaseEntity
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? CompanyName { get; set; }
        public string? Location { get; set; }
        public decimal? Salary { get; set; }
        public JobType JobType { get; set; }
        public DateTime PostedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; }

        public required Recruiter Recruiter { get; set; }
        public required string RecruiterId { get; set; }
    }
}
