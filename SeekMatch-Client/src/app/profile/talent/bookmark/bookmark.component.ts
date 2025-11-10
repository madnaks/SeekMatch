import { Component } from '@angular/core';
import { Bookmark } from '@app/shared/models/bookmark';
import { TalentService } from '@app/shared/services/talent.service';
import { TableAction, TableColumn } from "@app/shared/form-controls/data-table/data-table.component";

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
  public bookmarkActions: TableAction<Bookmark>[] = [];

  constructor(private talentService: TalentService) {
    this.bookmarksColumns = this.getBookmarksColumns();
    this.bookmarkActions = this.getBookmarksActions();
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
  }

  private getBookmarksColumns(): TableColumn<Bookmark>[] {
    return [
      {
        field: 'jobOfferTitle',
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

  private getBookmarksActions(): TableAction<Bookmark>[] {
    return [
      {
        icon: 'fa-eye',
        tooltip: 'View Job Offer',
        onClick: (row: Bookmark) => {
          this.viewJobOffer(row);
        }
      }
    ];
  }
}
