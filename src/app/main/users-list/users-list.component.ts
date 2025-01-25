import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../shared/pagination';
import { Subscription } from 'rxjs';
import { UserFormComponent } from './user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, Pagination],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  users: any[] = [];
  totalPages!: number;
  currentPage: number = 1;
  isLoading: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(private usersService: UsersService, private dialog: MatDialog, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.subscriptions.push(
      this.usersService.getUsers(this.currentPage).subscribe({
        next: (response) => {
          this.users = response.data; // The API's users are in the `data` field
          this.totalPages = response.total_pages;
        },
        error: (err) => {
          this.toastr.error('Failed to load users:', 'Error');
        },
      })
    );
  }

  // Open Modal method
  openUserFormModal(userId?: any): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px', // You can adjust the width as needed
      data: userId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
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
      (error) => {
        console.error('Error deleting user', error);
        this.isLoading = false;
      }
    );
  }

  paginationUpdate(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
