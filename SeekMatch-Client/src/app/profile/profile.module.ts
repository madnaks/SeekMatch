import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { GeneraleProfileComponent } from './generale-profile/generale-profile.component';
import { StudyProfileComponent } from './study-profile/study-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
