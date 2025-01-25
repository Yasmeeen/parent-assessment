import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule, NgbModalModule],
  providers: [ToastrService],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeUserForm();

  }

  initializeUserForm(){
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
          this.toastr.success('User created successfully!', 'Success');
          this.userForm.reset();
        },
        error => {
          this.toastr.success('Error creating user', 'Error');
        }
      );
    }
  }

}
