import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface PermissionDto {
    id: number;
    name: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class PermissionApiService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/permissions`;

    getAll() {
        return this.http.get<ApiResponse<PermissionDto[]>>(this.baseUrl).pipe(
            map(res => res.data ?? [])
        );
    }

    getById(id: number) {
        return this.http.get<ApiResponse<PermissionDto>>(`${this.baseUrl}/${id}`).pipe(
            map(res => res.data)
        );
    }
}
