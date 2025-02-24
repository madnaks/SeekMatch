import { JobType, WorkplaceType } from "../enums/enums";

export const months = [
  { id: 0, value: 'Date.SelectMonth' },
  { id: 1, value: 'Date.January' },
  { id: 2, value: 'Date.February' },
  { id: 3, value: 'Date.March' },
  { id: 4, value: 'Date.April' },
  { id: 5, value: 'Date.May' },
  { id: 6, value: 'Date.June' },
  { id: 7, value: 'Date.July' },
  { id: 8, value: 'Date.August' },
  { id: 9, value: 'Date.September' },
  { id: 10, value: 'Date.October' },
  { id: 11, value: 'Date.November' },
  { id: 12, value: 'Date.December' }
];

export const jobTypes = [
  { key: JobType.FullTime, value: 'Enum.JobType.FullTime' },
  { key: JobType.PartTime, value: 'Enum.JobType.PartTime' },
  { key: JobType.Internship, value: 'Enum.JobType.Internship' },
  { key: JobType.Contract, value: 'Enum.JobType.Contract' },
  { key: JobType.Freelance, value: 'Enum.JobType.Freelance' },
];

export const workplaceTypeList = [
  { key: WorkplaceType.OnSite, value: 'Enum.WorkplaceType.OnSite' },
  { key: WorkplaceType.Hybrid, value: 'Enum.WorkplaceType.Hybrid' },
  { key: WorkplaceType.Remote, value: 'Enum.WorkplaceType.Remote' }
];

export const EDITOR_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

export const countries = [
  { name: 'Canada', code: 'CA' },
  { name: 'United States', code: 'US' },
  { name: 'France', code: 'FR' },
  { name: 'Tunisia', code: 'TN' }
];  