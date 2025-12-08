import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { RepresentativeService } from '../../../shared/services/representative.service';
import { getPhoneNumberValue } from '@app/shared/utils';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss'
})
export class CompanyInfoComponent implements OnInit{

  companyForm: FormGroup;
  isLoading: boolean = true;
  isSaving: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder, 
    private representativeService: RepresentativeService, 
    private toastService: ToastService,
    private cd: ChangeDetectorRef) {
    this.companyForm = this.initCompanyForm();
  }

  ngOnInit(): void {
    this.initCompanyFormValues();
  }

  private initCompanyForm(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['',Validators.required],
      country: [''],
      region: [null],
      city: [null],
      description: [''],
      website: ['', [Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-]*)*\/?$/i)]]
    });
  }

  private initCompanyFormValues(): void {
    this.representativeService.getCompany().subscribe(company => {

      this.companyForm.patchValue({
        name: company.name,
        phone: company.phone,
        address: company.address,
        country: company.country,
        region: company.region,
        city: company.city,
        description: company.description,
        website: company.website
      });

      this.isLoading = false;

      this.cd.detectChanges();

    });
  }

  public updateCompany(): void {
    if (this.companyForm.valid) {
      this.isSaving = true;
      const companyData = this.companyForm.getRawValue();
      companyData.phone = getPhoneNumberValue(companyData.phone);

      this.representativeService.updateCompanyData(companyData).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: () => {
          this.toastService.showSuccessMessage('Company updated successfully!');
        },
        error: (error) => {
          this.toastService.showErrorMessage('Error updating company!', error);
        }
      })
    } else {
      this.companyForm.markAllAsTouched();
      this.toastService.showErrorMessage('Form is not valid');
    }
  }

}
