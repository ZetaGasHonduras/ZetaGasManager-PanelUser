import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaginatedResult<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface RoleRef {
    id: number;
    name: string;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    roles: RoleRef[];
    permissions: string[];
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    roleId: number;
}

export interface UpdateUserRequest {
    name: string;
    email: string;
    isActive: boolean;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface AssignRoleRequest {
    roleId: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/users`;

    getAll(params?: { page?: number; per_page?: number; search?: string }): Observable<PaginatedResult<UserDto>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get<PaginatedResult<UserDto>>(this.baseUrl, { params: httpParams });
    }

    getById(id: number) {
        return this.http.get<UserDto>(`${this.baseUrl}/${id}`);
    }

    create(request: CreateUserRequest) {
        return this.http.post<UserDto>(this.baseUrl, request);
    }

    update(id: number, request: UpdateUserRequest) {
        return this.http.put<UserDto>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    changePassword(id: number, request: ChangePasswordRequest) {
        return this.http.patch(`${this.baseUrl}/${id}/change-password`, request);
    }

    assignRole(id: number, request: AssignRoleRequest) {
        return this.http.patch(`${this.baseUrl}/${id}/assign-role`, request);
    }
}
