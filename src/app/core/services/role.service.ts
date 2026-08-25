import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaginatedResult<T> {
    current_page: number;
    data: T[];
    from: number;
    last_page: number;
    links: any[];
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface RoleDto {
    id: number;
    name: string;
    normalizedName: string;
    createdAt: string;
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
        return this.http.get<PaginatedResult<RoleDto>>(this.baseUrl, { params: httpParams });
    }

    getById(id: number) {
        return this.http.get<RoleDto>(`${this.baseUrl}/${id}`);
    }

    create(request: CreateRoleRequest) {
        return this.http.post<RoleDto>(this.baseUrl, request);
    }

    update(id: number, request: CreateRoleRequest) {
        return this.http.put<RoleDto>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    updatePermissions(id: number, request: UpdateRolePermissionsRequest) {
        return this.http.put(`${this.baseUrl}/permissions/${id}`, request);
    }
}
