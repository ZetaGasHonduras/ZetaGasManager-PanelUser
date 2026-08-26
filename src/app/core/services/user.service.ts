import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResult } from '../models/api-response.model';

export interface RoleRef {
    id: number;
    name: string;
}

export interface UserDto {
    id: number;
    name: string;
    username: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: string;
    roles: RoleRef[];
    permissions: string[];
}

export interface CreateUserRequest {
    name: string;
    username?: string | null;
    email?: string | null;
    password: string;
    password_confirmation: string;
    roleId: number;
    isActive?: boolean;
}

export interface UpdateUserRequest {
    name?: string;
    username?: string | null;
    email?: string | null;
    isActive?: boolean;
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
        return this.http.get<ApiResponse<UserDto[]>>(this.baseUrl, { params: httpParams }).pipe(
            map(res => ({ data: res.data ?? [], pagination: res.pagination! }))
        );
    }

    getById(id: number) {
        return this.http.get<ApiResponse<UserDto>>(`${this.baseUrl}/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(request: CreateUserRequest) {
        return this.http.post<ApiResponse<UserDto>>(this.baseUrl, request);
    }

    update(id: number, request: UpdateUserRequest) {
        return this.http.put<ApiResponse<UserDto>>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
    }

    changePassword(id: number, request: ChangePasswordRequest) {
        return this.http.patch<ApiResponse<null>>(`${this.baseUrl}/${id}/change-password`, request);
    }

    assignRole(id: number, request: AssignRoleRequest) {
        return this.http.patch<ApiResponse<null>>(`${this.baseUrl}/${id}/assign-role`, request);
    }
}
