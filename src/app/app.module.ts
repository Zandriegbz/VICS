import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ import this
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component'; // ✅ Add this
import { AppRoutingModule } from './app-routing.module';
import { VisitorLogbookComponent } from './visitor-logbook/visitor-logbook.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component'; // ✅ make sure this is here
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { TokenInterceptor } from './services/token.interceptor';
import { LoadingInterceptor } from './services/loading.interceptor';
import { CreditsComponent } from './credits/credits.component';
import { CertificateComponent } from './certificate/certificate.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    AdminNavbarComponent,
    VisitorLogbookComponent,
    NotificationModalComponent,
    AccountSettingsComponent, // ✅ Declare it here
    AdminLayoutComponent, CreditsComponent, CertificateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Added for animations support
    FormsModule, // ✅ Required for [(ngModel)]
    RouterModule,       // ✅ this line is important
    AppRoutingModule,   // ✅ routing config
    HttpClientModule,   // ✅ HTTP client for API calls
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })    // ✅ Loading spinner with default type
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
