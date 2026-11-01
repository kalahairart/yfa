export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'principal_broker' | 'staff_agent';
  avatar: string;
  token: string;
  loginTime: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
  rememberMe?: boolean;
}
