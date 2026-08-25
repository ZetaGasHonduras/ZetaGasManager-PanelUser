import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Permission } from '../authorization/permissions.enum';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private auth = inject(AuthService);

    hasPermission(permission: Permission): boolean {
        return this.auth.hasPermission(permission);
    }

    hasAny(...permissions: Permission[]): boolean {
        return permissions.some(p => this.auth.hasPermission(p));
    }

    hasAll(...permissions: Permission[]): boolean {
        return permissions.every(p => this.auth.hasPermission(p));
    }
}
