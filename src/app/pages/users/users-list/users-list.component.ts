import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { SearchableSelectComponent, SearchableOption } from '../../../shared/components/form/searchable-select/searchable-select.component';
import { UsersService, UserDto } from '../../../core/services/user.service';
import { RolesService, RoleDto } from '../../../core/services/role.service';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    SearchableSelectComponent,
    HasPermissionDirective,
  ],
  templateUrl: './users-list.component.html',
  styles: ``
})
export class UsersListComponent implements OnInit {
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private snackbar = inject(SnackbarService);

  users: UserDto[] = [];
  roles: RoleDto[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading = false;
  error = '';
  searchTerm = '';

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedUser: UserDto | null = null;
  saving = false;
  saveError = '';

  formName = '';
  formEmail = '';
  formPassword = '';
  formRoleId: number | null = null;
  formIsActive = true;

  showAssignRoleModal = false;
  assignRoleUser: UserDto | null = null;
  assignRoleId: number | null = null;
  assigningRole = false;

  showDeleteModal = false;
  userToDelete: UserDto | null = null;
  deleting = false;

  Permission = Permission;

  get roleOptions(): SearchableOption[] {
    return (this.roles ?? []).map(r => ({ value: r.id, label: r.name }));
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    this.usersService.getAll({ page: this.currentPage, per_page: this.pageSize, search: this.searchTerm || undefined }).subscribe({
      next: (res: any) => { this.users = Array.isArray(res) ? res : (res?.data ?? []); this.totalRecords = Array.isArray(res) ? res.length : (res?.total ?? 0); this.loading = false; },
      error: () => { this.error = 'Error al cargar usuarios'; this.loading = false; }
    });
  }

  loadRoles() {
    this.rolesService.getAll({ page: 1, per_page: 100 }).subscribe({
      next: (res: any) => { this.roles = Array.isArray(res) ? res : (res?.data ?? []); },
      error: () => { this.roles = []; }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedUser = null;
    this.formName = '';
    this.formEmail = '';
    this.formPassword = '';
    this.formRoleId = null;
    this.formIsActive = true;
    this.saveError = '';
    this.showModal = true;
  }

  openEditModal(user: UserDto) {
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.formName = user.name;
    this.formEmail = user.email;
    this.formPassword = '';
    this.formRoleId = user.roles?.length ? user.roles[0].id : null;
    this.formIsActive = user.isActive;
    this.saveError = '';
    this.showModal = true;
  }

  saveUser() {
    if (!this.formName.trim() || !this.formEmail.trim()) return;
    if (this.modalMode === 'create' && !this.formPassword.trim()) return;
    if (this.modalMode === 'create' && !this.formRoleId) return;

    this.saving = true;
    this.saveError = '';
    const userName = this.formName.trim();
    const isCreate = this.modalMode === 'create';

    this.showModal = false;

    if (isCreate) {
      this.usersService.create({
        name: userName,
        email: this.formEmail.trim(),
        password: this.formPassword.trim(),
        password_confirmation: this.formPassword.trim(),
        roleId: this.formRoleId!,
      }).subscribe({
        next: (res: any) => { this.saving = false; this.loadUsers(); this.snackbar.success(res?.message || `Usuario "${userName}" creado`); },
        error: (err) => { this.saving = false; this.snackbar.error(err.error?.message || 'Error al crear usuario'); }
      });
    } else if (this.selectedUser) {
      this.usersService.update(this.selectedUser.id, {
        name: userName,
        email: this.formEmail.trim(),
        isActive: this.formIsActive,
      }).subscribe({
        next: (res: any) => {
          if (this.formRoleId) {
            this.usersService.assignRole(this.selectedUser!.id, { roleId: this.formRoleId }).subscribe({
              next: () => { this.showModal = false; this.saving = false; this.loadUsers(); this.snackbar.success(res?.message || `Usuario "${userName}" actualizado`); },
              error: () => { this.showModal = false; this.saving = false; this.loadUsers(); this.snackbar.success(res?.message || `Usuario "${userName}" actualizado`); }
            });
          } else {
            this.showModal = false; this.saving = false; this.loadUsers(); this.snackbar.success(res?.message || `Usuario "${userName}" actualizado`);
          }
        },
        error: (err) => { this.saving = false; this.snackbar.error(err.error?.message || 'Error al actualizar usuario'); }
      });
    }
  }

  openAssignRoleModal(user: UserDto) {
    this.assignRoleUser = user;
    this.assignRoleId = user.roles?.length ? user.roles[0].id : null;
    this.showAssignRoleModal = true;
  }

  assignRole() {
    if (!this.assignRoleUser || !this.assignRoleId) return;
    this.assigningRole = true;
    this.usersService.assignRole(this.assignRoleUser.id, { roleId: this.assignRoleId }).subscribe({
      next: (res: any) => { this.showAssignRoleModal = false; this.assigningRole = false; this.loadUsers(); this.snackbar.success(res?.message || 'Rol asignado'); },
      error: (err) => { this.assigningRole = false; this.snackbar.error(err.error?.message || 'Error al asignar rol'); }
    });
  }

  confirmDelete(user: UserDto) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;
    this.deleting = true;
    this.usersService.delete(this.userToDelete.id).subscribe({
      next: (res: any) => { this.showDeleteModal = false; this.deleting = false; this.loadUsers(); this.snackbar.success(res?.message || `Usuario eliminado`); },
      error: (err) => { this.deleting = false; this.snackbar.error(err.error?.message || 'Error al eliminar usuario'); }
    });
  }

  toggleActive(user: UserDto) {
    this.usersService.update(user.id, { name: user.name, email: user.email, isActive: !user.isActive }).subscribe({
      next: () => { this.loadUsers(); this.snackbar.success(`Usuario ${!user.isActive ? 'activado' : 'desactivado'}`); },
      error: (err) => this.snackbar.error(err.error?.message || 'Error al cambiar estado')
    });
  }

  getRoleName(user: UserDto): string {
    return user.roles?.length ? user.roles[0].name : 'Sin rol';
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadUsers();
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
}
