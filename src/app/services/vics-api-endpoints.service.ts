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
  getVisitors = () => `/v1/VisitorLogs`;
  addVisitor = () => `/visitors`;
  getVisitorById = (id: string) => `/visitors/${id}`;
  updateVisitor = (id: string) => `/visitors/${id}`;
  deleteVisitor = (id: string) => `/visitors/${id}`;
  getVisitorCertificate = (visitorId: string) => `/v1/VisitorLogs/${visitorId}/certificate`;

  // Dashboard Endpoints
  getDashboardStats = () => `/dashboard/stats`;
  getTotalVisitorsTrend = () => `/dashboard/visitors-trend`;
  getDepartmentVisitors = () => `/dashboard/department-visitors`;
  
  // Notification Endpoints
  getNotifications = () => `/notifications`;
  markNotificationAsRead = (id: string) => `/notifications/${id}/read`;
  deleteNotification = (id: string) => `/notifications/${id}`;
} 