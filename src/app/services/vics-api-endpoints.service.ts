import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VicsApiEndpointsService {
  constructor() {}

  // Auth Endpoints
  login = () => `/auth/login`;
  resetPassword = () => `/auth/reset-password`;

  // Visitor Endpoints
  getVisitors = () => `/visitors`;
  addVisitor = () => `/visitors`;
  getVisitorById = (id: string) => `/visitors/${id}`;
  updateVisitor = (id: string) => `/visitors/${id}`;
  deleteVisitor = (id: string) => `/visitors/${id}`;

  // Dashboard Endpoints
  getDashboardStats = () => `/dashboard/stats`;
  getTotalVisitorsTrend = () => `/dashboard/visitors-trend`;
  getDepartmentVisitors = () => `/dashboard/department-visitors`;
  
  // Notification Endpoints
  getNotifications = () => `/notifications`;
  markNotificationAsRead = (id: string) => `/notifications/${id}/read`;
  deleteNotification = (id: string) => `/notifications/${id}`;
} 