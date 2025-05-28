import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // First check if the user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    
    // Check if route has data.roles specified
    const requiredRoles = next.data['roles'] as string[];
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No specific roles required
    }
    
    // Check if user has any of the required roles
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return false;
    }
    
    if (requiredRoles.includes(currentUser.role)) {
      return true;
    }
    
    // If the user doesn't have the required role, redirect to unauthorized page or dashboard
    this.router.navigate(['/admin/dashboard']);
    return false;
  }
} 