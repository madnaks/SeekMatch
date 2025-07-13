import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { AuthService } from '../../../shared/services/auth.service';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { jobTypes, workplaceTypeList } from '../../../shared/constants/constants';
import { TranslateService } from '@ngx-translate/core';
import { JobOfferFilter } from '../../../shared/enums/enums';

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
  public activeFilters: { key: JobOfferFilter, value: string }[] = [];

  constructor(
    private authService: AuthService,
    private fb: NonNullableFormBuilder,
    private translate: TranslateService
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
    this.computeActiveFilters();
  }

  public resetFilterForm(): void {
    this.filterForm.reset();
    this.appliedFilters = this.filterForm.value;
  }

  private computeActiveFilters(): void {
    this.activeFilters = [];

    const values = this.filterForm.value;

    if (values.title?.trim()) {
      this.activeFilters.push({ key: JobOfferFilter.Title, value: `Title: ${values.title}` });
    }

    if (values.companyName?.trim()) {
      this.activeFilters.push({ key: JobOfferFilter.Company, value: `Company: ${values.companyName}` });
    }

    if (values.type && values.type !== 0) {
      const jobType = this.jobTypesList.find(j => j.key === values.type);
      if (jobType) this.activeFilters.push({ key: JobOfferFilter.Type, value: `Type: ${this.translate.instant(jobType.value)}` });
    }

    if (values.workplaceType && values.workplaceType !== 0) {
      const workplace = this.workplaceTypeList.find(w => w.key === values.workplaceType);
      if (workplace) this.activeFilters.push({ key: JobOfferFilter.WorkplaceType, value: `Workplace: ${this.translate.instant(workplace.value)}` });
    }

  }

  public deleteFilter(filterKey: JobOfferFilter): void {
    switch (filterKey) {
      case JobOfferFilter.Title:
        this.filterForm.get('title')?.setValue('');
        break;
      case JobOfferFilter.Company:
        this.filterForm.get('companyName')?.setValue('');
        break;
      case JobOfferFilter.Type:
        this.filterForm.get('type')?.setValue(0);
        break;
      case JobOfferFilter.WorkplaceType:
        this.filterForm.get('workplaceType')?.setValue(0);
        break;
    }

    this.applyFilters();
  }

}
