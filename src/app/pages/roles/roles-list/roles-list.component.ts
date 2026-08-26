import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { RolesService, RoleDto } from '../../../core/services/role.service';
import { PermissionApiService, PermissionDto } from '../../../core/services/permission-api.service';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-roles-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageBreadcrumbComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    HasPermissionDirective,
  ],
  templateUrl: './roles-list.component.html',
  styles: ``
})
export class RolesListComponent implements OnInit {
  private rolesService = inject(RolesService);
  private permissionApi = inject(PermissionApiService);
  private snackbar = inject(SnackbarService);

  roles: RoleDto[] = [];
  allPermissions: PermissionDto[] = [];
  loading = false;
  error = '';
  totalRecords = 0;

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedRole: RoleDto | null = null;
  roleName = '';
  saving = false;

  currentPage = 1;
  pageSize = 10;

  available = signal<PermissionDto[]>([]);
  assigned = signal<PermissionDto[]>([]);
  searchAvailable = '';
  searchAssigned = '';
  selectedAvailable = signal<Set<number>>(new Set());
  selectedAssigned = signal<Set<number>>(new Set());

  filteredAvailable = computed(() =>
    this.available().filter(p =>
      p.description.toLowerCase().includes(this.searchAvailable.toLowerCase())
    )
  );

  filteredAssigned = computed(() =>
    this.assigned().filter(p =>
      p.description.toLowerCase().includes(this.searchAssigned.toLowerCase())
    )
  );

  Permission = Permission;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);
      if (current <= 2) { start = 2; end = 4; }
      if (current >= total - 1) { start = total - 3; end = total - 1; }
      if (start > 2) pages.push(-1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push(-2);
      pages.push(total);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRoles();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadRoles();
  }

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.loading = true;
    this.error = '';
    this.rolesService.getAll({ page: this.currentPage, per_page: this.pageSize }).subscribe({
      next: (res) => { this.roles = res.data; this.totalRecords = res.pagination.total; this.loading = false; },
      error: () => { this.error = 'Error al cargar roles'; this.loading = false; }
    });
  }

  loadPermissions() {
    this.permissionApi.getAll().subscribe({
      next: (res) => { this.allPermissions = res; },
      error: () => { this.allPermissions = []; }
    });
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.roleName = '';
    this.selectedRole = null;
    this.available.set([...this.allPermissions]);
    this.assigned.set([]);
    this.selectedAvailable.set(new Set());
    this.selectedAssigned.set(new Set());
    this.searchAvailable = '';
    this.searchAssigned = '';
    this.showModal = true;
  }

  openEditModal(role: RoleDto) {
    this.modalMode = 'edit';
    this.selectedRole = role;
    this.roleName = role.name;
    this.selectedAvailable.set(new Set());
    this.selectedAssigned.set(new Set());
    this.searchAvailable = '';
    this.searchAssigned = '';
    this.showModal = true;

    this.rolesService.getById(role.id).subscribe({
      next: (fullRole) => {
        const permNames: string[] = (fullRole.permissions ?? []).map(p => typeof p === 'string' ? p : p.name ?? '');
        this.assigned.set(this.allPermissions.filter(p => permNames.includes(p.name)));
        this.available.set(this.allPermissions.filter(p => !permNames.includes(p.name)));
      },
      error: () => {
        this.assigned.set([]);
        this.available.set([...this.allPermissions]);
      }
    });
  }

  toggleSelectAvailable(item: PermissionDto) {
    const s = new Set(this.selectedAvailable());
    s.has(item.id) ? s.delete(item.id) : s.add(item.id);
    this.selectedAvailable.set(s);
  }

  toggleSelectAssigned(item: PermissionDto) {
    const s = new Set(this.selectedAssigned());
    s.has(item.id) ? s.delete(item.id) : s.add(item.id);
    this.selectedAssigned.set(s);
  }

  isSelectedAvailable(item: PermissionDto): boolean {
    return this.selectedAvailable().has(item.id);
  }

  isSelectedAssigned(item: PermissionDto): boolean {
    return this.selectedAssigned().has(item.id);
  }

  agregar() {
    const ids = this.selectedAvailable();
    if (!ids.size) return;
    const toMove = this.available().filter(p => ids.has(p.id));
    this.assigned.set([...this.assigned(), ...toMove]);
    this.available.set(this.available().filter(p => !ids.has(p.id)));
    this.selectedAvailable.set(new Set());
  }

  quitar() {
    const ids = this.selectedAssigned();
    if (!ids.size) return;
    const toMove = this.assigned().filter(p => ids.has(p.id));
    this.available.set([...this.available(), ...toMove]);
    this.assigned.set(this.assigned().filter(p => !ids.has(p.id)));
    this.selectedAssigned.set(new Set());
  }

  save() {
    if (!this.roleName.trim()) return;
    this.saving = true;
    const permissionIds = this.assigned().map(p => Number(p.id));
    const roleName = this.roleName.trim();
    const isCreate = this.modalMode === 'create';
    const roleId = isCreate ? null : this.selectedRole!.id;

    const afterSave = (newId: number) => {
      this.rolesService.updatePermissions(newId, { permissionIds }).subscribe({
        next: () => { this.closeModal(); this.loadRoles(); this.snackbar.success(isCreate ? `Rol "${roleName}" creado` : `Rol "${roleName}" actualizado`); },
        error: (err) => {
          this.closeModal();
          this.loadRoles();
          this.snackbar.warning(err.message || 'Permisos no actualizados, pero el rol fue guardado');
        }
      });
    };

    if (isCreate) {
      this.rolesService.create({ name: roleName }).subscribe({
        next: (res) => {
          const newId = res.data?.id;
          if (newId) afterSave(newId);
          else { this.closeModal(); this.loadRoles(); }
        },
        error: (err) => { this.saving = false; this.snackbar.error(err.message || 'Error al crear rol'); }
      });
    } else {
      this.rolesService.update(roleId!, { name: roleName }).subscribe({
        next: () => afterSave(roleId!),
        error: (err) => { this.saving = false; this.snackbar.error(err.message || 'Error al actualizar rol'); }
      });
    }
  }

  deleteRole(role: RoleDto) {
    if (!confirm(`¿Eliminar el rol "${role.name}"?`)) return;
    this.rolesService.delete(role.id).subscribe({
      next: (res) => { this.loadRoles(); this.snackbar.success(res.message || `Rol "${role.name}" eliminado`); },
      error: (err) => this.snackbar.error(err.message || 'Error al eliminar rol')
    });
  }

  closeModal() {
    this.showModal = false;
    this.saving = false;
    this.roleName = '';
    this.selectedRole = null;
    this.available.set([]);
    this.assigned.set([]);
    this.selectedAvailable.set(new Set());
    this.selectedAssigned.set(new Set());
  }
}
