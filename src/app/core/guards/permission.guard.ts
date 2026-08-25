import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Permission } from '../authorization/permissions.enum';

export function permissionGuard(permission: Permission): CanActivateFn {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        if (auth.hasPermission(permission)) return true;

        router.navigate(['/']);
        return false;
    };
}
