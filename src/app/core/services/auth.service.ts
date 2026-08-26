import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { Permission } from '../authorization/permissions.enum';

export interface LoginRequest {
    login: string;
    password: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: AuthUser;
}

export interface MeResponse {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    roles: string[];
    permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);
    private router = inject(Router);

    private readonly baseUrl = `${environment.apiUrl}/api/auth`;

    currentUser = signal<AuthUser | null>(
        this.storage.getUser<AuthUser>()
    );

    hasPermission(permission: Permission): boolean {
        const user = this.currentUser();
        if (!user) return false;
        return user.permissions.includes(permission);
    }

    hasRole(role: string): boolean {
        const user = this.currentUser();
        if (!user) return false;
        return user.roles.includes(role);
    }

    login(request: LoginRequest) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
            tap(response => {
                this.storage.setTokens(response.accessToken, response.accessToken);
                this.storage.setUser(response.user);
                this.currentUser.set(response.user);
            })
        );
    }

    getMe() {
        return this.http.get<MeResponse>(`${this.baseUrl}/me`).pipe(
            tap(response => {
                const user: AuthUser = {
                    id: response.id,
                    name: response.name,
                    email: response.email,
                    roles: response.roles,
                    permissions: response.permissions,
                };
                this.storage.setUser(user);
                this.currentUser.set(user);
            })
        );
    }

    logout(): void {
        this.storage.clear();
        this.currentUser.set(null);
        this.router.navigate(['/signin']);
    }

    isAuthenticated(): boolean {
        return this.storage.isAuthenticated();
    }
}
