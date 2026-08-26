import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResult } from '../models/api-response.model';

export interface RoleDto {
    id: number;
    name: string;
    normalizedName: string;
    permissions_count: string;
    createdAt: string;
    updatedAt: string;
    permissions?: { id: number; name: string; description: string }[];
}

export interface CreateRoleRequest {
    name: string;
}

export interface UpdateRolePermissionsRequest {
    permissionIds: number[];
}

@Injectable({ providedIn: 'root' })
export class RolesService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/roles`;

    getAll(params?: { page?: number; per_page?: number; search?: string }): Observable<PaginatedResult<RoleDto>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get<ApiResponse<RoleDto[]>>(this.baseUrl, { params: httpParams }).pipe(
            map(res => ({
                data: res.data ?? [],
                pagination: res.pagination ?? { total: (res.data ?? []).length, perPage: (res.data ?? []).length, currentPage: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false }
            }))
        );
    }

    getById(id: number) {
        return this.http.get<ApiResponse<RoleDto>>(`${this.baseUrl}/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(request: CreateRoleRequest) {
        return this.http.post<ApiResponse<RoleDto>>(this.baseUrl, request);
    }

    update(id: number, request: CreateRoleRequest) {
        return this.http.put<ApiResponse<RoleDto>>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
    }

    updatePermissions(id: number, request: UpdateRolePermissionsRequest) {
        return this.http.put<ApiResponse<null>>(`${this.baseUrl}/permissions/${id}`, request);
    }
}
