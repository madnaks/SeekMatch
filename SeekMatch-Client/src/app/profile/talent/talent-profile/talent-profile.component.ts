import { Component } from '@angular/core';
import { TalentService } from '../../../shared/services/talent.service';
import { SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/services/toast.service';
import { Talent } from '../../../shared/models/talent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalActionType } from '../../../shared/enums/enums';

@Component({
  selector: 'app-talent-profile',
  templateUrl: './talent-profile.component.html',
  styleUrl: './talent-profile.component.scss'
})
export class TalentProfileComponent {

  isLoading: boolean = true;
  profilePicture: SafeUrl | string | null = null;
  currentTalent: Talent | null = null;
  isSummaryExpanded = false;
  
  constructor(
    private modalService: NgbModal,
    private talentService: TalentService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.initCurrentTalent();
  }

  private initCurrentTalent() {
    this.talentService.getProfile().subscribe(talent => {
      this.currentTalent = new Talent(talent);
      if (this.currentTalent.profilePicture) {
        this.profilePicture = `data:image/jpeg;base64,${talent.profilePicture}`;
      } else {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
      }
      this.isLoading = false;
    });
  }

  public openEditProfileModal(content: any): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'lg' });
  }

  public openTalentPreviewModal(content: any): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Profile saved successfully');
      this.initCurrentTalent();
    }
  }

  public get hasLongSummary(): boolean {
    return !!this.currentTalent?.summary && this.currentTalent.summary.length > 150;
  }

}
