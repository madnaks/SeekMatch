import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { GeneraleProfileComponent } from './generale-profile/generale-profile.component';
import { StudyProfileComponent } from './study-profile/study-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    TalentProfileComponent,
    GeneraleProfileComponent,
    StudyProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule
  ]
})
export class ProfileModule { }
