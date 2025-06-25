import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiEndpointsSpy: jasmine.SpyObj<VicsApiEndpointsService>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const apiEndpointsSpyObj = jasmine.createSpyObj('VicsApiEndpointsService', ['login', 'resetPassword']);
    
    apiEndpointsSpyObj.login.and.returnValue('/auth/login');
    apiEndpointsSpyObj.resetPassword.and.returnValue('/auth/reset-password');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: VicsApiEndpointsService, useValue: apiEndpointsSpyObj }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    apiEndpointsSpy = TestBed.inject(VicsApiEndpointsService) as jasmine.SpyObj<VicsApiEndpointsService>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse = {
      success: true,
      message: 'Login successful',
      user: { id: 1, username: 'testuser', email: 'test@example.com', role: 'admin' },
      token: 'fake-jwt-token'
    };

    service.login('testuser', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('vics_auth_token')).toBe('fake-jwt-token');
      expect(localStorage.getItem('vics_user_data')).toBe(JSON.stringify(mockResponse.user));
    });

    const req = httpMock.expectOne(`http://localhost:7000/api/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password' });
    req.flush(mockResponse);
  });

  it('should logout and clear storage', () => {
    // Setup initial state
    localStorage.setItem('vics_auth_token', 'test-token');
    localStorage.setItem('vics_user_data', JSON.stringify({ id: 1, username: 'test' }));
    
    service.logout();
    
    expect(localStorage.getItem('vics_auth_token')).toBeNull();
    expect(localStorage.getItem('vics_user_data')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check if user is logged in', () => {
    localStorage.removeItem('vics_auth_token');
    expect(service.isLoggedIn()).toBeFalse();
    
    localStorage.setItem('vics_auth_token', 'test-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should get current user from localStorage', () => {
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', role: 'admin' };
    localStorage.setItem('vics_user_data', JSON.stringify(mockUser));
    
    const user = service.getCurrentUser();
    expect(user).toEqual(mockUser);
  });

  it('should handle resetPassword', () => {
    const mockResponse = {
      success: true,
      message: 'Password reset instructions sent'
    };

    service.resetPassword('test@example.com').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:7000/api/auth/reset-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });
    req.flush(mockResponse);
  });
}); 