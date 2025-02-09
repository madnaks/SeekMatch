import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TalentService } from '../../../shared/services/talent.service';
import { finalize } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/services/toast.service';
import { formatDateToISO } from '../../../shared/utils';
import { Talent } from '../../../shared/models/talent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-about-you',
  templateUrl: './about-you.component.html',
  styleUrl: './about-you.component.scss'
})
export class AboutYouComponent {

  aboutYouForm: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;
  isLoading: boolean = true;
  isSaving: boolean = false;

  profilePicture: SafeUrl | string | null = null;
  defaultProfilePicture: boolean = true;

  // new props
  currentTalent: Talent | null = null;

  constructor(
    private modalService: NgbModal,
    private fb: NonNullableFormBuilder, 
    private talentService: TalentService, 
    private toastService: ToastService) {
    this.aboutYouForm = this.initAboutYouForm();
    this.configureDatePicker();
  }

  ngOnInit(): void {
    this.initAboutYouFormValues();
    this.initCurrentTalent();
  }
  
  private initCurrentTalent() {
    this.talentService.getProfile().subscribe(talent => {
      this.currentTalent = new Talent(talent);
    });
  }

  public openTalentPreviewModal(content: any): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
  }

  saveProfile() {
    if (this.aboutYouForm.valid) {
      this.isSaving = true;
      const aboutYouData = this.aboutYouForm.value;

      aboutYouData.dateOfBirth = formatDateToISO(aboutYouData.dateOfBirth);

      this.talentService.saveAboutYouData(aboutYouData).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: () => {
          this.toastService.showSuccessMessage('Profile saved successfully!');
        },
        error: (error) => {
          this.toastService.showErrorMessage('Error saving profile!', error);
        }
      })
    } else {
      this.toastService.showErrorMessage('Form is not valid');
    }
  }

  private configureDatePicker(): void {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'YYYY-MM-DD',
      isAnimated: true,
      showWeekNumbers: false
    });
  }

  private initAboutYouForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      profileTitle: [''],
      dateOfBirth: [null, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.email]],
      address: [''],
      phone: [''],
      city: [''],
      zip: ['']
    });
  }

  private initAboutYouFormValues() {
    this.talentService.getProfile().subscribe(talent => {
      const dateOfBirth = talent.dateOfBirth === '0001-01-01' ? null : talent.dateOfBirth;

      this.aboutYouForm.patchValue({
        firstName: talent.firstName,
        lastName: talent.lastName,
        profileTitle: talent.profileTitle,
        dateOfBirth: dateOfBirth,
        address: talent.address,
        email: talent.email,
        phone: talent.phone
      });

      if (talent.profilePicture) {
        this.profilePicture = `data:image/jpeg;base64,${talent.profilePicture}`;
        this.defaultProfilePicture = false;
      } else {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
      }

      this.isLoading = false;
    });
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

      this.talentService.uploadProfilePicture(file).subscribe({
        next: () => {
          this.defaultProfilePicture  = false;
          this.toastService.showSuccessMessage('Profile picture saved successfully!');
        },
        error: (error) => this.toastService.showErrorMessage('Error uploading profile picture!', error)
      });

    }
  }

  removeImage(): void {
    this.talentService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
        this.defaultProfilePicture  = true;
        this.toastService.showSuccessMessage('Profile picture removed successfully!');
      },
      error: (error) => this.toastService.showErrorMessage('Error deleting profile picture!', error)
    });

  }

}
