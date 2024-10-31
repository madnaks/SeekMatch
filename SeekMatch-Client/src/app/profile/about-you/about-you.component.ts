import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TalentService } from '../../shared/services/talent.service';
import { finalize } from 'rxjs';

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

  profileImage: string | ArrayBuffer | null = null; // Load this from backend if available

  constructor(private fb: NonNullableFormBuilder, private talentService: TalentService) {
    this.aboutYouForm = this.initAboutYouForm();
    this.configureDatePicker();
  }

  ngOnInit(): void {
    this.initAboutYouFormValues();
  }

  saveProfile() {
    if (this.aboutYouForm.valid) {
      this.isSaving = true;
      const aboutYouData = this.aboutYouForm.value;
      // Check if dateOfBirth has a value and is not null
      if (aboutYouData.dateOfBirth) {

        // Extract 'yyyy-MM-dd'
        const formattedDateOfBirth = aboutYouData.dateOfBirth instanceof Date
          ? aboutYouData.dateOfBirth.toISOString().split('T')[0]
          : aboutYouData.dateOfBirth;

        aboutYouData.dateOfBirth = formattedDateOfBirth;
      }
      
      this.talentService.saveAboutYouData(aboutYouData).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: (response) => {
          console.log('Profile saved successfully!', response);
        },
        error: (error) => {
          console.error('Error saving profile!', error);
        }
      })
    } else {
      console.log('Form is not valid');
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
      dateOfBirth: [null],
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
      this.isLoading = false;
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.profileImage = null;
  }

}
