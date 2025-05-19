import { User } from '../types';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'pfn_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'pfn_refresh_token';
  private static readonly USER_KEY = 'pfn_user';

  static setTokens(data: TokenData): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static hasValidTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

export default TokenStorage; 