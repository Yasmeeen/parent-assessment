import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  userId!: number;
  selectedUser:any;
  isLoading: boolean = true;

  constructor(
    private userService: UsersService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.userId = this.data;
    this.getUserDetails();
  }

  // Fetch user details for editing
  getUserDetails(): void {
    this.isLoading = true;
    this.userService.getUser(this.userId).subscribe((response: any) => {
      this.selectedUser = response.data;
      this.isLoading = false;
    },
    (error) => {
      this.isLoading = false;
      this.toastr.error('Error Updating user', 'Error');
    });
  }
}
