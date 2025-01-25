import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  providers: [ToastrService],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit: boolean = false;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.userId = this.data;
    if (this.userId) {
      console.log("this.userId",this.userId);

      this.isEdit = true;
      this.getUserDetails();
    }

    this.initializeUserForm();
  }

  initializeUserForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Fetch user details for editing
  getUserDetails(): void {
    this.userService.getUser(this.userId).subscribe((response: any) => {
      const user = response.data;
      this.userForm.patchValue({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      let userData = this.userForm.value;
      if (this.isEdit) {
        this.updateUser(userData);
      } else {
        this.createUser(userData);
      }
    }
  }
  updateUser(userData: any) {
    // Call the UserService to create a new user
    this.userService.updateUser(this.userId, userData).subscribe(
      (response) => {
        this.toastr.success('User created successfully!', 'Success');
        this.userForm.reset();
        this.close(true);
      },
      (error) => {
        this.toastr.error('Error Updating user', 'Error');
      }
    );
  }

  createUser(userData: any) {
    // Call the UserService to create a new user
    this.userService.createUser(userData).subscribe(
      (response) => {
        this.toastr.success('User Updated successfully!', 'Success');
        this.userForm.reset();
        this.close(true);
      },
      (error) => {
        this.toastr.error('Error creating user', 'Error');
      }
    );
  }

  close(isUpdated?: boolean): void {
    this.dialogRef.close(isUpdated); // Close the dialog
  }
}
