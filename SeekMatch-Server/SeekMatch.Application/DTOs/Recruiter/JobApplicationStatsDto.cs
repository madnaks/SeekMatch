namespace SeekMatch.Application.DTOs.Recruiter
{
    public class JobApplicationStatsDto
    {
        public int Total { get; set; }
        public int Submitted { get; set; }
        public int Shortlisted { get; set; }
        public int InterviewScheduled { get; set; }
        public int Hired { get; set; }
        public int Rejected { get; set; }
    }
}
