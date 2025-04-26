
export type UserRole = 'admin' | 'manager' | 'technician' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const ROLE_CONFIG = {
  admin: {
    label: 'Administrator',
    color: 'status-valid',
    permissions: ['read', 'write', 'update', 'delete', 'manage_users']
  },
  manager: {
    label: 'Manager',
    color: 'status-warning',
    permissions: ['read', 'write', 'update']
  },
  technician: {
    label: 'Technician',
    color: 'status-urgent',
    permissions: ['read', 'write']
  },
  viewer: {
    label: 'Viewer',
    color: 'status-inactive',
    permissions: ['read']
  }
};
