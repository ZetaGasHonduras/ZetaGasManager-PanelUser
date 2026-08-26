import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResult } from '../models/api-response.model';

export interface MunicipalityDepartment {
    id: number;
    name: string;
    ineCode: string;
}

export interface MunicipalityDto {
    id: number;
    name: string;
    ineCode: string;
    department: MunicipalityDepartment;
}

export interface CreateMunicipalityRequest {
    departmentId: number;
    name: string;
    ineCode: string;
}

export interface UpdateMunicipalityRequest {
    departmentId?: number;
    name?: string;
    ineCode?: string;
}

@Injectable({ providedIn: 'root' })
export class MunicipalityService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/municipalities`;

    getAll(params?: { page?: number; per_page?: number; search?: string }): Observable<PaginatedResult<MunicipalityDto>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get<ApiResponse<MunicipalityDto[]>>(this.baseUrl, { params: httpParams }).pipe(
            map(res => ({
                data: res.data ?? [],
                pagination: res.pagination ?? { total: (res.data ?? []).length, perPage: (res.data ?? []).length, currentPage: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false }
            }))
        );
    }

    getById(id: number) {
        return this.http.get<ApiResponse<MunicipalityDto>>(`${this.baseUrl}/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(request: CreateMunicipalityRequest) {
        return this.http.post<ApiResponse<MunicipalityDto>>(this.baseUrl, request);
    }

    update(id: number, request: UpdateMunicipalityRequest) {
        return this.http.put<ApiResponse<MunicipalityDto>>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number) {
        return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
    }
}
