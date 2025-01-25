import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../shared/pagination';
import { PaginationData } from '../../core/models/pagination.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule,Pagination],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  users: any[] = [];
  paginationPerPage:number = 5;
  paginationData!: PaginationData;
  totalPages!: number;
  currentPage: number = 1;
  usersParams: any = {
    page: 1,
    perPage: this.paginationPerPage,
  };
  private subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers(this.currentPage).subscribe({
      next: (response) => {
        this.users = response.data; // The API's users are in the `data` field
        this.totalPages = response.total_pages;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      },
    });
  }
  createOrEditUser(){

  }

  paginationUpdate(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(s => s && s.unsubscribe())
  }
}
