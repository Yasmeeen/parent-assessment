import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserFormComponent } from './user-form.component';
import { UsersService } from '../../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

// Mock Services
class MockToastrService {
  success = jasmine.createSpy();
  error = jasmine.createSpy();
}

class MockMatDialogRef {
  close = jasmine.createSpy();
}

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let toastr: MockToastrService;
  let dialogRef: jasmine.SpyObj<MatDialogRef<UserFormComponent, boolean>>;  // Adding type arguments here

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['getUser', 'updateUser', 'createUser']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserFormComponent],
      providers: [
        FormBuilder,
        { provide: UsersService, useValue: userServiceSpy },
        { provide: ToastrService, useClass: MockToastrService },
        { provide: MAT_DIALOG_DATA, useValue: 1 }, // mock userId as 1 for editing
        { provide: MatDialogRef, useClass: MockMatDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    toastr =  TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<UserFormComponent, boolean>>; // Providing type arguments

    fixture.detectChanges();
  });

  it('should create the form with default values', () => {
    expect(component).toBeTruthy();
    expect(component.userForm).toBeDefined();
    expect(component.userForm.controls['firstName'].value).toBe('');
    expect(component.userForm.controls['lastName'].value).toBe('');
    expect(component.userForm.controls['email'].value).toBe('');
  });

  it('should call getUserDetails when editing', () => {
    component.ngOnInit();
    expect(userService.getUser).toHaveBeenCalledOnceWith(1);
    expect(component.isEdit).toBeTrue();
  });

  it('should populate the form with user data when editing', () => {
    userService.getUser.and.returnValue(of({ data: { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }}));

    component.ngOnInit();
    expect(component.userForm.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    });
  });

  it('should call updateUser and show success message on form submission (edit)', () => {
    userService.updateUser.and.returnValue(of({}));
    component.userForm.setValue({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
    component.isEdit = true;
    component.onSubmit();
    expect(userService.updateUser).toHaveBeenCalledOnceWith(1, component.userForm.value);
    expect(toastr.success).toHaveBeenCalledWith('User created successfully!', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call createUser and show success message on form submission (create)', () => {
    userService.createUser.and.returnValue(of({}));
    component.userForm.setValue({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
    component.isEdit = false;
    component.onSubmit();
    expect(userService.createUser).toHaveBeenCalledOnceWith(component.userForm.value);
    expect(toastr.success).toHaveBeenCalledWith('User Updated successfully!', 'Success');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should show error message on error during user creation', () => {
    userService.createUser.and.returnValue(throwError('Error'));
    component.userForm.setValue({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
    component.isEdit = false;
    component.onSubmit();
    expect(toastr.error).toHaveBeenCalledWith('Error creating user', 'Error');
  });

  it('should show error message on error during user update', () => {
    userService.updateUser.and.returnValue(throwError('Error'));
    component.userForm.setValue({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
    component.isEdit = true;
    component.onSubmit();
    expect(toastr.error).toHaveBeenCalledWith('Error Updating user', 'Error');
  });

  it('should close the dialog when close method is called', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith(undefined);
  });
});
