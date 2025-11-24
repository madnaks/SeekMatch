import { JobApplicationStatus } from "@app/shared/enums/enums";
import { TableColumn } from "@app/shared/form-controls/data-table/data-table.component";
import { JobApplication } from "@app/shared/models/job-application";

export const JobApplicationsColumns: TableColumn<JobApplication>[] = [
    {
        field: 'jobOfferTitle',
        header: 'Talent.JobApplication.Table.Title',
        type: 'text',
        sortable: true
    },
    {
        field: 'appliedAt',
        header: 'Talent.JobApplication.Table.AppliedAt',
        type: 'date',
        sortable: true,
        formatter: () => "yyyy-MM-dd HH:mm"
    },
    {
        field: 'status',
        header: 'Talent.JobApplication.Table.Status',
        type: 'enum',
        sortable: true,
        formatter: (value: JobApplicationStatus) => `Enum.JobApplicationStatus.${JobApplicationStatus[value]}`,
        badgeClass: (value: JobApplicationStatus) => {
            switch (value) {
                case JobApplicationStatus.Submitted: return 'bg-warning';
                case JobApplicationStatus.Shortlisted: return 'bg-primary';
                case JobApplicationStatus.InterviewScheduled: return 'bg-info';
                case JobApplicationStatus.Hired: return 'bg-success';
                case JobApplicationStatus.Rejected: return 'bg-danger';
                case JobApplicationStatus.Withdrawn: return 'bg-secondary';
                default: return 'bg-light';
            }
        }
    }
];