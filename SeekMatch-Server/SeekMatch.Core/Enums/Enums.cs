namespace SeekMatch.Core.Enums
{
    public enum UserRole
    {
        Talent = 1,
        Recruiter = 2,
        Representative = 3,
        CompanyRecruiter = 4
    }

    public enum JobType
    {
        FullTime = 1,
        PartTime = 2,
        Internship = 3,
        Temporary = 4,
        Freelance = 5
    }

    public enum WorkplaceType
    {
        OnSite = 1,
        Hybrid = 2,
        Remote = 3
    }

    public enum JobApplicationStatus
    {
        Submitted = 0,
        Shortlisted = 1,
        InterviewScheduled = 2,
        Hired = 3,
        Rejected = 4,
        Withdrawn = 5
    }

}
