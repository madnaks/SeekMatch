import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobApplicationStatus } from '@app/shared/enums/enums';
import { JobApplication } from '@app/shared/models/job-application';
import { JobApplicationService } from '@app/shared/services/job-application.service';
import { ToastService } from '@app/shared/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-job-application-steps',
    templateUrl: './job-application-steps.component.html',
    styleUrl: './job-application-steps.component.scss'
})
export class JobApplicationStepsComponent {

    @Input() jobApplication: JobApplication | null = null;

    @ViewChild('shortListedConfirmationModal') shortListedConfirmationModal!: TemplateRef<any>;
    @ViewChild('interviewScheduledModal') interviewScheduledModal!: TemplateRef<any>;
    @ViewChild('hireConfirmationModal') hireConfirmationModal!: TemplateRef<any>;
    @ViewChild('rejectJobApplicationModal') rejectJobApplicationModal!: TemplateRef<any>;

    public jobApplicationSteps = [
        { icon: 'fas fa-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.SUBMITTED', value: JobApplicationStatus.Submitted },
        { icon: 'fa-solid fa-list-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.SHORTLISTED', value: JobApplicationStatus.Shortlisted },
        { icon: 'fa-solid fa-calendar-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.INTERVIEW-SCHEDULED', value: JobApplicationStatus.InterviewScheduled },
        { icon: 'fa-solid fa-handshake', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.HIRED', value: JobApplicationStatus.Hired },
        { icon: 'fas fa-xmark', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.REJECTED', value: JobApplicationStatus.Rejected }
    ];
    public platforms = [
        { name: 'Teams' },
        { name: 'Google Meet' },
        { name: 'Zoom' },
        { name: 'Other' }
    ];

    public interviewForm: FormGroup;
    public rejectionForm: FormGroup;
    public isSaving: boolean = false;

    constructor(
        private modalService: NgbModal, 
        private fb: FormBuilder,
        private jobApplicationService: JobApplicationService,
        private toastService: ToastService) {
        this.interviewForm = this.initInterviewForm();
        this.rejectionForm = this.initRejectionForm();
    }

    private initInterviewForm(): FormGroup {
        return this.fb.group({
            platform: ['', Validators.required],
            date: [null, Validators.required]
        });
    }

    private initRejectionForm(): FormGroup {
        return this.fb.group({
            reason: ['', Validators.required],
        });
    }

    public applicateStepClicked(currentStep: number, stepIndex: number): void {
        if (this.isCompleted(currentStep)) {
            return;
        }
        switch (stepIndex) {
            case JobApplicationStatus.Shortlisted:
                this.modalService.open(this.shortListedConfirmationModal, { centered: true, backdrop: 'static' });
                break;
            case JobApplicationStatus.InterviewScheduled:
                this.modalService.open(this.interviewScheduledModal, { centered: true, backdrop: 'static' });
                break;
            case JobApplicationStatus.Hired:
                this.modalService.open(this.hireConfirmationModal, { centered: true, backdrop: 'static' });
                break;
            case JobApplicationStatus.Rejected:
                this.modalService.open(this.rejectJobApplicationModal, { centered: true, backdrop: 'static' });
                break;
            default:
                break;
        }
    }

    public isCompleted(stepValue: number): boolean {
        return stepValue <= this.jobApplication!.status;
    }

    public isNext(stepValue: number): boolean {
        return stepValue === this.jobApplication!.status + 1;
    }

    public isRejectedStep(index: number): boolean {
        return index === JobApplicationStatus.Rejected;
    }

    public isRejected(): boolean {
        return this.jobApplication!.status === JobApplicationStatus.Rejected;
    }

    public canClick(stepValue: number): boolean {
        return (
            this.isCompleted(stepValue) ||
            this.isNext(stepValue) ||
            stepValue === JobApplicationStatus.Rejected
        );
    }

    public getStepIconClasses(stepValue: number, index: number): any {
        return {
            'bg-success text-white': this.isCompleted(stepValue) && !this.isRejected(),
            'bg-danger text-white': this.isRejectedStep(index),
            'bg-secondary text-white': this.isRejected() && !this.isRejectedStep(index),
            'bg-light text-secondary border border-2 border-secondary': !this.isCompleted(stepValue),
            'active': this.isNext(stepValue),
            'cursor-pointer': this.canClick(stepValue)
        };
    }

    public getStepTextClasses(stepValue: number): any {
        return {
            'fw-bold': stepValue <= this.jobApplication!.status,
            'text-secondary': stepValue > this.jobApplication!.status
        };
    }

    public onShortlistConfirmed(modal: any): void {
        this.isSaving = true;
        this.jobApplicationService.shortList(this.jobApplication?.id || '').pipe(
            finalize(() => {
                this.isSaving = false;
            })).subscribe({
                next: () => {
                    if (this.jobApplication) {
                        this.jobApplication.status = JobApplicationStatus.Shortlisted;
                        this.toastService.showSuccessMessage('Job application shortlisted successfully');
                        modal.close('Yes');
                    }
                },
                error: (err) => {
                    console.error('Error shortlisting application', err);
                }
            });
    }

    public onInterviewScheduledConfirmed(modal: any): void {
        if (this.interviewForm.invalid) {
            this.interviewForm.markAllAsTouched();
            return;
        }
        this.isSaving = true;
        this.jobApplicationService.interviewScheduled(this.jobApplication?.id, this.interviewForm.value).pipe(
            finalize(() => {
                this.isSaving = false;
            })).subscribe({
                next: () => {
                    if (this.jobApplication) {
                        this.jobApplication.status = JobApplicationStatus.InterviewScheduled;
                        this.toastService.showSuccessMessage('Interview scheduled successfully');
                        modal.close('Yes');
                    }
                },
                error: (err) => {
                    console.error('Error scheduling application', err);
                }
            });
    }

    public onHireConfirmed(modal: any): void {
        this.isSaving = true;
        this.jobApplicationService.hire(this.jobApplication?.id || '').pipe(
            finalize(() => {
                this.isSaving = false;
            })).subscribe({
                next: () => {
                    if (this.jobApplication) {
                        this.jobApplication.status = JobApplicationStatus.Hired;
                        this.toastService.showSuccessMessage('Talent hired successfully');
                        modal.close('Yes');
                    }
                },
                error: (err) => {
                    console.error('Error while hiring the talent', err);
                }
            });
    }

    public onRejectJobApplication(modal: any): void {
        if (this.rejectionForm.invalid) {
            this.rejectionForm.markAllAsTouched();
            return;
        }
        this.isSaving = true;
        if (this.jobApplication && this.jobApplication.id) {
            this.jobApplicationService.reject(this.jobApplication.id, this.rejectionForm.value.reason).pipe(
                finalize(() => {
                    this.isSaving = false;
                    this.modalService.dismissAll();
                })).subscribe({
                    next: () => {
                        if (this.jobApplication) {
                            this.jobApplication.status = JobApplicationStatus.Rejected;
                        }
                        this.toastService.showSuccessMessage('Job application rejected successfully');
                        modal.close('Yes');
                    },
                    error: (error) => {
                        this.toastService.showErrorMessage('Rejecting Job application failed', error);
                    }
                });
        } else {
            this.toastService.showErrorMessage('Job application ID is undefined, cannot reject');
        }
    }


}
