import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Bookmark } from '@app/shared/models/bookmark';
import { TalentService } from '@app/shared/services/talent.service';
import { TableColumn } from "@app/shared/form-controls/data-table/data-table.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.scss'
})
export class BookmarkComponent {

  public bookmarks: Bookmark[] = [];
  public isLoading: boolean = true;
  public selectedBookmark: Bookmark | null = null;
  public bookmarksColumns: TableColumn<Bookmark>[] = [];

  @ViewChild('previewJobOfferContent') previewJobOfferContent!: TemplateRef<any>;

  constructor(
    private talentService: TalentService,
    private modalService: NgbModal) {
    this.bookmarksColumns = this.getBookmarksColumns();
    this.getBookmarks();
  }

  private getBookmarks(): void {
    this.talentService.getAllBookmarks().subscribe((bookmarks) => {
      this.bookmarks = bookmarks;
      this.isLoading = false;
    });
  } 

  public viewJobOffer(bookmark: Bookmark): void {
    this.selectedBookmark = bookmark;
    this.modalService.open(this.previewJobOfferContent, { centered: true, backdrop: 'static', size: 'xl' });
  }

  public rowClicked(bookmark: Bookmark): void {
    this.viewJobOffer(bookmark);
  }

  private getBookmarksColumns(): TableColumn<Bookmark>[] {
    return [
      {
        field: 'jobOffer.title',
        header: 'Job Offer Title',
        type: 'text'
      },
      {
        field: 'createdAt',
        header: 'Created At',
        type: 'date'
      }
    ];
  }
}
