import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResult } from '../models/api-response.model';

export interface MunicipalityRef {
    id: number;
    name: string;
    ineCode: string;
    departmentId: number;
}

export interface DepartmentDto {
    id: number;
    name: string;
    ineCode: string;
    municipalities?: MunicipalityRef[];
}

export interface CreateDepartmentRequest {
    name: string;
    ineCode: string;
}

export interface UpdateDepartmentRequest {
    name?: string;
    ineCode?: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/departments`;

    getAll(params?: { page?: number; per_page?: number; search?: string }): Observable<PaginatedResult<DepartmentDto>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get<ApiResponse<DepartmentDto[]>>(this.baseUrl, { params: httpParams }).pipe(
            map(res => ({
                data: res.data ?? [],
                pagination: res.pagination ?? { total: (res.data ?? []).length, perPage: (res.data ?? []).length, currentPage: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false }
            }))
        );
    }

    getById(id: number) {
        return this.http.get<ApiResponse<DepartmentDto>>(`${this.baseUrl}/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(request: CreateDepartmentRequest) {
        return this.http.post<ApiResponse<DepartmentDto>>(this.baseUrl, request);
    }

    update(id: number, request: UpdateDepartmentRequest) {
        return this.http.put<ApiResponse<DepartmentDto>>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
    }

    getMunicipalitiesByDepartment(id: number, params?: { page?: number; per_page?: number; search?: string }): Observable<PaginatedResult<MunicipalityRef>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get<ApiResponse<MunicipalityRef[]>>(`${this.baseUrl}/${id}/municipalities`, { params: httpParams }).pipe(
            map(res => ({
                data: res.data ?? [],
                pagination: res.pagination ?? { total: (res.data ?? []).length, perPage: (res.data ?? []).length, currentPage: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false }
            }))
        );
    }
}
