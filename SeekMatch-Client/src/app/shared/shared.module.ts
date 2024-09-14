import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HeaderSimplifiedComponent } from './components/header-simplified/header-simplified.component';

@NgModule({
  declarations: [HeaderComponent, HeaderSimplifiedComponent],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule,
    RouterModule
  ],
  exports: [HeaderComponent, HeaderSimplifiedComponent]
})
export class SharedModule { }
