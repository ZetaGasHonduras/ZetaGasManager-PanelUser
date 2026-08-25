import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    loader.show();
    return next(req).pipe(finalize(() => loader.hide()));
  }

  return next(req);
};
