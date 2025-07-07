import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VisitorLogbookComponent } from './visitor-logbook/visitor-logbook.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { CreditsComponent } from './credits/credits.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'credits', component: CreditsComponent },
  
  // Redirect dashboard to admin dashboard with auth guard
  { 
    path: 'dashboard', 
    redirectTo: '/admin/dashboard', 
    pathMatch: 'full'
  },
  
  // Protected admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { 
        path: 'visitor-logbook', 
        component: VisitorLogbookComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
    ]
  },
  
  // Fallback route
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
