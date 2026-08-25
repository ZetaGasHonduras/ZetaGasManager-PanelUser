import { Injectable } from '@angular/core';

const TOKEN_KEY = 'zetagas_access_token';
const REFRESH_KEY = 'zetagas_refresh_token';
const USER_KEY = 'zetagas_user';

@Injectable({ providedIn: 'root' })
export class StorageService {

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_KEY, refreshToken);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_KEY);
    }

    setUser(user: object): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser<T>(): T | null {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) as T : null;
    }

    clear(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }
}
