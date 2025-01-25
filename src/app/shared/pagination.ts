import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { PaginationData } from '../core/models/pagination.model';
import { CommonModule } from '@angular/common';

@Injectable()
@Component({
  selector: 'pagination',
  imports: [CommonModule],
  template: `
    <div class="pagination">
      <button
        class="btn btn-primary"
        (click)="previousPage()"
        [disabled]="currentPage === 1"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="btn btn-primary"
        (click)="nextPage()"
        [disabled]="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  `,
  styles: [
    `
      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
      }

      .pagination button {
        margin: 0 10px;
      }

      .pagination span {
        margin: 0 10px;
        font-size: 16px;
      }
    `,
  ],
})
export class Pagination {
  @Input() currentPage: number = 1;
  @Input() totalPages!: number;
  @Output() paginationUpdate = new EventEmitter();

  constructor() {}
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginationUpdate.emit(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginationUpdate.emit(this.currentPage);
    }
  }
}
