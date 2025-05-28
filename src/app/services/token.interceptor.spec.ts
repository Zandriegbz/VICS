import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('TokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header if token exists', () => {
    authServiceSpy.getToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe();

    const httpRequest = httpMock.expectOne('/api/test');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add Authorization header if token does not exist', () => {
    authServiceSpy.getToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const httpRequest = httpMock.expectOne('/api/test');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });

  it('should handle 401 error by calling logout and redirecting', () => {
    authServiceSpy.getToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe(
      () => fail('Should have failed with 401 error'),
      (error) => {
        // We expect this to fail, so this is correct
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      }
    );

    const httpRequest = httpMock.expectOne('/api/test');
    httpRequest.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
}); 