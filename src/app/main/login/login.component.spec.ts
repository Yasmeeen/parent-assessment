import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth/auth.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    // Mock AuthService
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    // Mock Router
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    // Mock ToastrService
    const toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges(); // Trigger ngOnInit and form initialization
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password fields', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should mark form as invalid when fields are empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should call AuthService.login and navigate on successful login', () => {
    const mockResponse = { token: 'mock-token' };
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(router.navigate).toHaveBeenCalledWith(['/main/users']);
    expect(toastr.success).toHaveBeenCalledWith('Login successfully', 'Success');
  });

  it('should display an error message when login fails', () => {
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(toastr.error).toHaveBeenCalledWith('Error Login Failed', 'Error');
  });

  it('should not call AuthService.login when the form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();

    expect(authService.login).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });
});
