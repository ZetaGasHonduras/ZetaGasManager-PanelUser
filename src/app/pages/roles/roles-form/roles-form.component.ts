import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { RolesService, RoleDto } from '../../../core/services/role.service';
import { PermissionApiService, PermissionDto } from '../../../core/services/permission-api.service';

@Component({
  selector: 'app-roles-form',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageBreadcrumbComponent,
    ButtonComponent,
  ],
  templateUrl: './roles-form.component.html',
  styles: ``
})
export class RolesFormComponent implements OnInit {
  private rolesService = inject(RolesService);
  private permissionApi = inject(PermissionApiService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  permissions: PermissionDto[] = [];
  selectedPermissionIds: number[] = [];
  roleName = '';
  isEdit = false;
  roleId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  ngOnInit() {
    this.loadPermissions();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.roleId = +id;
      this.loadRole(this.roleId);
    }
  }

  loadPermissions() {
    this.permissionApi.getAll().subscribe({
      next: (data) => { this.permissions = data; },
      error: () => {}
    });
  }

  loadRole(id: number) {
    this.loading = true;
    this.rolesService.getById(id).subscribe({
      next: (role) => {
        this.roleName = role.name;
        this.loading = false;
      },
      error: () => { this.error = 'Error al cargar el rol'; this.loading = false; }
    });
  }

  togglePermission(permissionId: number) {
    const idx = this.selectedPermissionIds.indexOf(permissionId);
    if (idx >= 0) {
      this.selectedPermissionIds.splice(idx, 1);
    } else {
      this.selectedPermissionIds.push(permissionId);
    }
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissionIds.includes(permissionId);
  }

  save() {
    if (!this.roleName.trim()) return;
    this.saving = true;

    if (this.isEdit && this.roleId) {
      this.rolesService.update(this.roleId, { name: this.roleName.trim() }).subscribe({
        next: () => {
          this.rolesService.updatePermissions(this.roleId!, { permissionIds: this.selectedPermissionIds }).subscribe({
            next: () => this.router.navigate(['/roles']),
            error: () => { this.saving = false; }
          });
        },
        error: () => { this.saving = false; }
      });
    } else {
      this.rolesService.create({ name: this.roleName.trim() }).subscribe({
        next: (created) => {
          if (this.selectedPermissionIds.length > 0) {
            this.rolesService.updatePermissions(created.id, { permissionIds: this.selectedPermissionIds }).subscribe({
              next: () => this.router.navigate(['/roles']),
              error: () => { this.saving = false; }
            });
          } else {
            this.router.navigate(['/roles']);
          }
        },
        error: () => { this.saving = false; }
      });
    }
  }
}
