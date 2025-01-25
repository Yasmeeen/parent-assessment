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
  totalPages!: number;
  currentPage: number = 1;
  isLoading: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.subscriptions.push(this.usersService.getUsers(this.currentPage).subscribe({
      next: (response) => {
        this.users = response.data; // The API's users are in the `data` field
        this.totalPages = response.total_pages;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      },
    }));
  }

    // Edit user logic
    editUser(userId: number): void {
      console.log('Edit user with ID:', userId);
      // Implement edit logic (e.g., open a modal or navigate to an edit page)
    }

    // Delete user logic
    deleteUser(userId: number): void {
      this.isLoading = true;
      this.usersService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted:', userId);
          // After deletion, reload users to refresh the list
          this.loadUsers();
          this.isLoading = false;
        },
        error => {
          console.error('Error deleting user', error);
          this.isLoading = false;
        }
      );
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
