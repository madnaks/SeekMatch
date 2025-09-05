export enum UserRole {
    Talent = 1,
    Recruiter = 2,
    Representative = 3
}

export enum JobType {
    FullTime = 1,
    PartTime = 2,
    Internship = 3,
    Contract = 4,
    Freelance = 5
}

export enum WorkplaceType
{
    OnSite = 1,
    Hybrid = 2,
    Remote = 3
}

export enum ToastType {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
}

export enum ModalActionType {
    Create = 1,
    Update = 2,
    Delete = 3,
    Close = 4
}

export enum JobApplicationStatus
{
    Pending = 0,
    Shortlisted = 1,
    InterviewScheduled = 2,
    Offered = 3,
    Rejected = 4,
    Withdrawn = 5
}

export enum JobOfferFilter {
    Title = 0,
    Company = 1,
    Type = 2,
    WorkplaceType = 3
}