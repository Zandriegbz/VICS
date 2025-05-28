# VICS Project API and Structure Alignment Plan

## Phase 1: API and Backend Connection Setup

### 1. API URL Configuration
- [x] **Create Environment Files:**
    - [x] Create `src/environments/environment.ts` in VICS.
        ```typescript
        // src/environments/environment.ts (VICS)
        export const environment = {
          production: false,
          apiUrl: 'VICS_DEVELOPMENT_API_URL' // e.g., 'http://localhost:7000/api'
        };
        ```
    - [x] Create `src/environments/environment.prod.ts` in VICS.
        ```typescript
        // src/environments/environment.prod.ts (VICS)
        export const environment = {
          production: true,
          apiUrl: 'VICS_PRODUCTION_API_URL'
        };
        ```
    - [x] Verify `fileReplacements` for environment files in `angular.json` (usually default).
- [x] **Create Connection File:**
    - [x] Create `src/app/connection.ts` in VICS.
        ```typescript
        // src/app/connection.ts (VICS)
        import { environment } from '../environments/environment';
        export const api: string = environment.apiUrl;
        ```

### 2. HTTP Client and Token Interceptor
- [x] **Add `HttpClientModule` to `AppModule`:**
    - [x] Import `HttpClientModule` and `HTTP_INTERCEPTORS` from `@angular/common/http` in `VICSdraft/src/app/app.module.ts`.
    - [x] Add `HttpClientModule` to the `imports` array in `AppModule`.
    - [x] Add the `HTTP_INTERCEPTORS` provider for the `TokenInterceptor` in `AppModule`.
- [x] **Create `TokenInterceptor`:**
    - [x] Create `src/app/services/token.interceptor.ts` in VICS.
    - [x] Implement the interceptor logic:
        - Inject VICS `AuthService` and `Router`.
        - **Use `SweetAlert2` for notifications:** Plan to install `sweetalert2` and use it directly in the interceptor for user feedback.
        - Get token from `authService.getToken()`.
        - If token exists, clone request and add `Authorization: Bearer <token>` header.
        - Handle HTTP errors, specifically 401:
            - Call `authService.logout()`.
            - Redirect to `/login`.
            - Show "Session Expired" notification using `SweetAlert2`.

### 3. Refactor `AuthService` (VICS)
- [x] **Modify `src/app/services/auth.service.ts` in VICS:**
    - [x] Inject `HttpClient`. (Router is already injected).
    - [x] **Update `login()` method:**
        - [x] Remove mock user logic.
        - [x] Implement HTTP POST to `api + '/VICS_AUTH_LOGIN_ENDPOINT'`.
            - **Confirm with seniors:** Backend expected credential casing (e.g., `Username` or `username`).
        - [x] On success:
            - Store JWT: `localStorage.setItem('vics_auth_token', response.token);` (or a similar key).
            - Store user data: `localStorage.setItem('vics_user_data', JSON.stringify(response.user));`.
            - Update `this.currentUser` and `this.isAuthenticated`.
        - [x] Handle login errors (e.g., invalid credentials) and use `SweetAlert2` for feedback.
    - [x] **Implement `getToken()` method:**
        - [x] `getToken(): string | null { return localStorage.getItem('vics_auth_token'); }`
    - [x] **Update `logout()` method:**
        - [x] Clear `'vics_auth_token'` and `'vics_user_data'` from `localStorage`.
        - [x] Reset `this.isAuthenticated = false`, `this.currentUser = null`.
        - [x] Navigate to `/login`.
    - [x] **Update `isLoggedIn()` method:**
        - [x] `isLoggedIn(): boolean { return !!this.getToken(); }`
    - [x] **Update `getCurrentUser()` method:**
        - [x] Parse and return data from `'vics_user_data'`. Return `null` if not found.
    - [x] **(Optional) Refactor `resetPassword()`:**
        - [x] Update to make an actual API call to the VICS backend endpoint for password reset.

### 4. Centralize API Endpoints (Recommended)
- [x] **Create `VicsApiEndpointsService`:**
    - [x] Create `src/app/services/vics-api-endpoints.service.ts`.
    - [x] Define methods that return endpoint strings (e.g., `getVisitors = () => /visitors;`).
        ```typescript
        // Example:
        import { Injectable } from '@angular/core';

        @Injectable({ providedIn: 'root' })
        export class VicsApiEndpointsService {
          constructor() {}

          // Visitor Endpoints
          getVisitors = () => `/visitors`;
          addVisitor = () => `/visitors`; // Assuming same endpoint for POST
          getVisitorById = (id: string) => `/visitors/${id}`;
          updateVisitor = (id: string) => `/visitors/${id}`;
          deleteVisitor = (id: string) => `/visitors/${id}`;

          // Dashboard Endpoints
          getDashboardStats = () => `/dashboard/stats`;
          getTotalVisitorsTrend = () => `/dashboard/visitors-trend`;
          getDepartmentVisitors = () => `/dashboard/department-visitors`;
          // ... add more as needed for VICS
        }
        ```

### 5. Refactor Feature Services (e.g., `VisitorService`, `DashboardService`, `NotificationService`)
- [x] **For each feature service:**
    - [x] Inject `HttpClient`. (Keep VICS `ErrorService` for now, or plan to replace its usage with `SweetAlert2` in components later).
    - [x] Inject `VicsApiEndpointsService` (if created in step 4).
    - [x] Import the `api` constant from `src/app/connection.ts`.
    - [x] **Remove all mock data and `Observable<of()>` logic.**
    - [x] **Update methods to make HTTP calls:**
        - Use `this.http.get/post/put/delete`.
        - Construct full URL: `api + this.apiEndpoints.SpecificMethodForVICS()`.
        - Ensure request/response types match backend.
        - Pipe API calls through `catchError`.
        - In `catchError`, use `this.errorService.showError()` for user feedback (or transition to `SweetAlert2` if chosen for all notifications).
        - *(Example for `VisitorService.getVisitors()`):*
            ```typescript
            // Make sure to import catchError from 'rxjs/operators' and throwError from 'rxjs'
            // Also HttpErrorResponse from '@angular/common/http'
            getVisitors(): Observable<Visitor[]> {
              return this.http.get<Visitor[]>(api + this.apiEndpoints.getVisitors()).pipe(
                catchError(err => this.handleError(err, 'Failed to retrieve visitors'))
              );
            }
            // Implement a private handleError method
            // private handleError(error: HttpErrorResponse, message: string): Observable<never> {
            //   // ... error handling logic, possibly using ErrorService or SweetAlert2 ...
            //   return throwError(() => new Error(message));
            // }
            ```
    - [x] Specific Services to refactor:
        - [x] `src/app/services/visitor.service.ts`
        - [x] `src/app/services/dashboard.service.ts`
        - [x] `src/app/services/notification.service.ts` (if notifications come from backend, otherwise this service might be purely client-side or removed if `SweetAlert2` handles all).

## Phase 2: UI and UX Consistency

### 6. User Feedback/Notifications (Implement `SweetAlert2`)
- [x] **Install `SweetAlert2`:** `npm install sweetalert2`.
- [x] **Replace VICS `ErrorService` usage:**
    - [x] In components where `ErrorService.showError/showWarning/showInfo` was used, replace with `Swal.fire({...})` calls for user feedback.
- [x] **Update `TokenInterceptor`:**
    - [x] Ensure the `TokenInterceptor` uses `SweetAlert2` for 401 session expired notifications.
- [x] **Cleanup `ErrorService` and `ErrorToastComponent`:**
    - [x] Remove `ErrorToastComponent` from `app.component.html`.
    - [x] Remove `ErrorToastComponent` from declarations in `app.module.ts`.
    - [ ] Remove `ErrorService` from providers in `app.module.ts` and delete the service file if it's no longer used anywhere.

### 7. External Theme JavaScript (If Needed)
- [x] **Evaluate if any external JavaScript files (e.g., for theme functionality like menus, charts) are needed for VICS.**
- [x] **If YES, integrate them:**
    - [x] **Preferred:** Add paths to these JS files to the `scripts` array in `VICSdraft/angular.json`. Ensure any configuration scripts (like a `config.js`) are listed before other theme scripts that depend on it.
    - [ ] **Alternative (Less Ideal):** Add `<script>` tags to `VICSdraft/src/index.html`.
- [ ] **If NO, no action needed.**

## Phase 3: Polish and Final Review

### 8. NPM Packages
- [x] Review necessary npm packages for common functionalities.
- [x] Install any useful packages (e.g., `ngx-spinner` if consistent loading indicators are desired, or other UI libraries that enhance the user experience).
    - Example: `npm install ngx-spinner`

### 9. Code Review and Testing
- [x] Thoroughly test all API interactions in VICS.
- [x] Test login, logout, and session expiration (401 handling).
- [x] Verify error messages and notifications (using `SweetAlert2`) are displayed correctly.
- [x] Review code for consistency with established project patterns.