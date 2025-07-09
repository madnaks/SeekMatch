import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { AuthService } from '../../../shared/services/auth.service';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { JobType, WorkplaceType } from '../../../shared/enums/enums';
import { jobTypes, workplaceTypeList } from '../../../shared/constants/constants';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class JobOffersComponent implements OnInit {

  @Output() filtersChanged = new EventEmitter<any>();

  public selectedJobOffer: JobOffer | null = null;
  public isMobileView: boolean = false;
  public showDetailsOnMobile: boolean = false;
  public canApply: boolean = false;
  public isSaving: boolean = false;
  public filterForm: FormGroup;
  public jobTypesList = jobTypes;
  public workplaceTypeList = workplaceTypeList;
  public appliedFilters: any = {};

  constructor(
    private authService: AuthService,
    private fb: NonNullableFormBuilder
  ) {
    this.filterForm = this.initForm();
  }

  ngOnInit(): void {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView.bind(this));
    this.canApply = this.authService.canApply();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      title: [''],
      companyName: [''],
      type: [0],
      workplaceType: [0]
    });
  }

  private checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768;
    if (this.isMobileView) {
      this.selectedJobOffer = null;
    }
  }

  public onJobOfferSelected(jobOffer: any): void {
    this.selectedJobOffer = jobOffer;
    if (this.isMobileView) {
      this.showDetailsOnMobile = true;
    }
  }

  public applyFilters(): void {
    this.appliedFilters = this.filterForm.value;
  }

  public resetFilterForm(): void {
    this.filterForm.reset();
    this.appliedFilters = this.filterForm.value;

  }

}
