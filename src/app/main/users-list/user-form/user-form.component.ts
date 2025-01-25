import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    // Initialize form
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('User Data:', userData);

      // Call the UserService to create a new user
      this.userService.createUser(userData).subscribe(
        response => {
          console.log('User created successfully', response);
          alert('User created successfully');
          // Optionally reset the form after successful submission
          this.userForm.reset();
        },
        error => {
          console.error('Error creating user', error);
          alert('Error creating user');
        }
      );
    }
  }
}
