import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storage.clear();
        router.navigate(['/signin']);
      }

      const body = error.error;
      const message = body?.message || error.message || 'Error del servidor';
      const errors: string[] = body?.errors || [];

      return throwError(() => ({ status: error.status, message, errors }));
    })
  );
};
