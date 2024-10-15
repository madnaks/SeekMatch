import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TalentService } from '../../shared/services/talent.service';

@Component({
  selector: 'app-about-you-profile',
  templateUrl: './about-you-profile.component.html',
  styleUrl: './about-you-profile.component.scss'
})
export class AboutYouProfileComponent {

  aboutYouForm: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;
  isLoading: boolean = true;

  constructor(private fb: NonNullableFormBuilder, private talentService: TalentService) {
    this.aboutYouForm = this.initGeneraleForm();
    this.configureDatePicker();
  }

  ngOnInit(): void {
    this.talentService.getProfile().subscribe(talent => {
      this.aboutYouForm.patchValue({
        firstName: talent.firstName,
        lastName: talent.lastName,
        profileTitle: talent.profileTitle,
        // dateOfBirth: talent.dateOfBirth,
        address: talent.address,
        email: talent.email,
        phone: talent.phone
      });
      this.isLoading = false;
    });
  }

  saveProfile() {
    if (this.aboutYouForm.valid) {
      debugger
      const aboutYouData = this.aboutYouForm.value;
      this.talentService.saveAboutYouData(aboutYouData).subscribe({
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

  private initGeneraleForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      profileTitle: [''],
      // dateOfBirth: [null],
      email: [{ value: '', disabled: true }, [Validators.email]],
      address: [''],
      phone: [''],
      city: [''],
      zip: ['']
    });
  }

}
