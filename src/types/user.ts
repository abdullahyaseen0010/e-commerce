export interface Address {
  id: string;
  label?: string; // e.g. "Home", "Office"
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string; // ISO date
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NotificationPreference {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}
