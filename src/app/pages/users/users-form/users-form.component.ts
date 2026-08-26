import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SearchableSelectComponent, SearchableOption } from '../../../shared/components/form/searchable-select/searchable-select.component';
import { UsersService, UserDto } from '../../../core/services/user.service';
import { RolesService, RoleDto } from '../../../core/services/role.service';

@Component({
  selector: 'app-users-form',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageBreadcrumbComponent,
    ButtonComponent,
    SearchableSelectComponent,
  ],
  templateUrl: './users-form.component.html',
  styles: ``
})
export class UsersFormComponent implements OnInit {
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  roles: RoleDto[] = [];
  isEdit = false;
  userId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  name = '';
  username = '';
  email = '';
  password = '';
  roleId: number | null = null;
  isActive = true;

  get roleOptions(): SearchableOption[] {
    return this.roles.map(r => ({ value: r.id, label: r.name }));
  }

  ngOnInit() {
    this.loadRoles();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadRoles() {
    this.rolesService.getAll({ page: 1, per_page: 50 }).subscribe({
      next: (res) => { this.roles = res.data; },
      error: () => {}
    });
  }

  loadUser(id: number) {
    this.loading = true;
    this.usersService.getById(id).subscribe({
      next: (user) => {
        this.name = user.name;
        this.username = user.username || '';
        this.email = user.email || '';
        this.isActive = user.isActive;
        this.roleId = user.roles?.length ? user.roles[0].id : null;
        this.loading = false;
      },
      error: () => { this.error = 'Error al cargar el usuario'; this.loading = false; }
    });
  }

  save() {
    if (!this.name.trim()) return;
    if (!this.isEdit && !this.username.trim() && !this.email.trim()) return;
    this.saving = true;

    if (this.isEdit && this.userId) {
      this.usersService.update(this.userId, {
        name: this.name.trim(),
        username: this.username.trim() || null,
        email: this.email.trim() || null,
        isActive: this.isActive,
      }).subscribe({
        next: () => {
          if (this.roleId) {
            this.usersService.assignRole(this.userId!, { roleId: this.roleId }).subscribe({
              next: () => this.router.navigate(['/users']),
              error: () => { this.saving = false; }
            });
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: () => { this.saving = false; }
      });
    } else {
      if (!this.password.trim() || !this.roleId) {
        this.saving = false;
        return;
      }
      this.usersService.create({
        name: this.name.trim(),
        username: this.username.trim() || null,
        email: this.email.trim() || null,
        password: this.password.trim(),
        password_confirmation: this.password.trim(),
        roleId: this.roleId,
      }).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => { this.saving = false; this.error = err.message || 'Error al crear usuario'; }
      });
    }
  }
}
