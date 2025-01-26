import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '../../services/users.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailsComponent } from './user-details/user-details.component';

class MockUsersService {
  getUsers(page: number) {
    return of({
      data: [{ id: 1, name: 'John Doe' }],
      total_pages: 1,
    });
  }

  deleteUser(userId: number) {
    return of(null);
  }
}

class MockToastrService {
  success(message: string, title?: string) {}
  error(message: string, title?: string) {}
}

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let usersService: UsersService;
  let toastr: ToastrService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [UsersListComponent],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: ToastrService, useClass: MockToastrService },
        MatDialog,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    toastr = TestBed.inject(ToastrService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on initialization', () => {
    spyOn(usersService, 'getUsers').and.callThrough();
    component.ngOnInit();
    expect(usersService.getUsers).toHaveBeenCalledWith(component.currentPage);
    expect(component.users.length).toBeGreaterThan(0);
  });

  it('should open the user form modal', () => {
    spyOn(dialog, 'open').and.callThrough();
    component.openUserFormModal(1);
    expect(dialog.open).toHaveBeenCalledWith(UserFormComponent, {
      width: '500px',
      data: 1,
    });
  });

  it('should reload users after closing the user form modal', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as any);
    spyOn(component, 'loadUsers');

    component.openUserFormModal(1);
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('should delete a user and reload users', () => {
    spyOn(usersService, 'deleteUser').and.callThrough();
    spyOn(toastr, 'success');
    spyOn(component, 'loadUsers');

    component.deleteUser(1);
    expect(usersService.deleteUser).toHaveBeenCalledWith(1);
    expect(toastr.success).toHaveBeenCalledWith('User deleted', 'Success');
    expect(component.loadUsers).toHaveBeenCalled();
  });


  it('should open the user details modal', () => {
    spyOn(dialog, 'open').and.callThrough();
    component.openUserDetailsModal(1);
    expect(dialog.open).toHaveBeenCalledWith(UserDetailsComponent, {
      width: '500px',
      data: 1,
    });
  });

  it('should update pagination and reload users', () => {
    spyOn(component, 'loadUsers');
    component.paginationUpdate(2);
    expect(component.currentPage).toBe(2);
    expect(component.loadUsers).toHaveBeenCalled();
  });

});
