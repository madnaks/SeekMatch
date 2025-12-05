import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/services/toast.service';
import { RepresentativeService } from '../../../shared/services/representative.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.scss'
})
export class CompanyInfoComponent {

  companyForm: FormGroup;
  isLoading: boolean = true;
  isSaving: boolean = false;

  profilePicture: SafeUrl | string | null = null;
  defaultProfilePicture: boolean = true;

  constructor(
    private fb: NonNullableFormBuilder, 
    private representativeService: RepresentativeService, 
    private toastService: ToastService) {
    this.companyForm = this.initCompanyForm();
  }

  ngOnInit(): void {
    this.initCompanyFormValues();
  }

  private initCompanyForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['',Validators.required],
      country: [''],
      region: [null],
      city: [null],
    });
  }

  private initCompanyFormValues(): void {
    this.representativeService.getCompany().subscribe(company => {

      this.companyForm.patchValue({
        name: company.name,
        phoneNumber: company.phoneNumber,
        address: company.address
        
      });

      this.isLoading = false;
    });
  }

  public updateCompany(): void {
    if (this.companyForm.valid) {
      this.isSaving = true;
      const companyData = this.companyForm.value;

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
      this.toastService.showErrorMessage('Form is not valid');
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePicture = reader.result;
      };

      reader.readAsDataURL(file);

      this.representativeService.uploadProfilePicture(file).subscribe({
        next: () => {
          this.defaultProfilePicture  = false;
          this.toastService.showSuccessMessage('Profile picture saved successfully!');
        },
        error: (error) => this.toastService.showErrorMessage('Error uploading profile picture!', error)
      });

    }
  }

  removeImage(): void {
    this.representativeService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
        this.defaultProfilePicture  = true;
        this.toastService.showSuccessMessage('Profile picture removed successfully!');
      },
      error: (error) => this.toastService.showErrorMessage('Error deleting profile picture!', error)
    });

  }

}
