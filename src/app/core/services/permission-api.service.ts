import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
        return this.http.get<PermissionDto[]>(this.baseUrl);
    }

    getById(id: number) {
        return this.http.get<PermissionDto>(`${this.baseUrl}/${id}`);
    }
}
