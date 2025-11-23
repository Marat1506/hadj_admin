'use client';

import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface SignInWithPhoneAndPasswordParams {
  phone: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Login failed' };
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem('custom-auth-token', data.accessToken);
      localStorage.setItem('user-data', JSON.stringify(data.user));

      return {};
    } catch (err) {
      console.error(err);
      return { error: 'An unexpected error occurred' };
    }
  }

  async signInWithPhoneAndPassword(params: SignInWithPhoneAndPasswordParams): Promise<{ error?: string }> {
    const { phone, password } = params;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Login failed' };
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem('custom-auth-token', data.accessToken);
      localStorage.setItem('user-data', JSON.stringify(data.user));

      return {};
    } catch (err) {
      console.error(err);
      return { error: 'An unexpected error occurred' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/findMe`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('custom-auth-token');
        localStorage.removeItem('user-data');
        return { data: null, error: 'Failed to fetch user data' };
      }

      const userData: User = await response.json();
      localStorage.setItem('user-data', JSON.stringify(userData));
      return { data: userData };
    } catch (e) {
      console.error('Failed to fetch user data from API', e);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('user-data');

    return {};
  }
}

export const authClient = new AuthClient();
