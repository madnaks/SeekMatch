import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TalentService } from '../../services/talent.service';

@Component({
  selector: 'app-about-you-profile',
  templateUrl: './about-you-profile.component.html',
  styleUrl: './about-you-profile.component.scss'
})
export class AboutYouProfileComponent {

  generaleForm: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(private fb: NonNullableFormBuilder, private talentService: TalentService) {
    this.generaleForm = this.initGeneraleForm();

    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue',
      isAnimated: true,
      showWeekNumbers: false
    });
  }

  ngOnInit(): void {
    this.talentService.getProfile().subscribe(profileData => {
      this.generaleForm.patchValue({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profileTitle: profileData.profileTitle,
        email: profileData.email,
        address: profileData.address,
        phone: profileData.phone
      });
    });
  }

  private initGeneraleForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      profileTitle: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

}
