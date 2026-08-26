import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { DepartmentService, DepartmentDto } from '../../../core/services/department.service';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-departments-list',
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    ButtonComponent,
    BadgeComponent,
    ModalComponent,
    HasPermissionDirective,
  ],
  templateUrl: './departments-list.component.html',
  styles: ``
})
export class DepartmentsListComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private snackbar = inject(SnackbarService);

  departments: DepartmentDto[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading = false;
  error = '';
  searchTerm = '';

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedDepartment: DepartmentDto | null = null;
  saving = false;

  formName = '';
  formIneCode = '';

  showDeleteModal = false;
  departmentToDelete: DepartmentDto | null = null;
  deleting = false;

  Permission = Permission;

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;
    this.error = '';
    this.departmentService.getAll({ page: this.currentPage, per_page: this.pageSize, search: this.searchTerm || undefined }).subscribe({
      next: (res) => { this.departments = res.data; this.totalRecords = res.pagination.total; this.loading = false; },
      error: () => { this.error = 'Error al cargar departamentos'; this.loading = false; }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadDepartments();
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedDepartment = null;
    this.formName = '';
    this.formIneCode = '';
    this.showModal = true;
  }

  openEditModal(dept: DepartmentDto) {
    this.modalMode = 'edit';
    this.selectedDepartment = dept;
    this.formName = dept.name;
    this.formIneCode = dept.ineCode;
    this.showModal = true;
  }

  save() {
    if (!this.formName.trim() || !this.formIneCode.trim()) return;
    this.saving = true;
    const name = this.formName.trim();
    const ineCode = this.formIneCode.trim();
    const isCreate = this.modalMode === 'create';

    if (isCreate) {
      this.departmentService.create({ name, ineCode }).subscribe({
        next: (res) => { this.showModal = false; this.saving = false; this.loadDepartments(); this.snackbar.success(res.message || `Departamento "${name}" creado`); },
        error: (err) => { this.saving = false; this.snackbar.error(err.message || 'Error al crear departamento'); }
      });
    } else if (this.selectedDepartment) {
      this.departmentService.update(this.selectedDepartment.id, { name, ineCode }).subscribe({
        next: (res) => { this.showModal = false; this.saving = false; this.loadDepartments(); this.snackbar.success(res.message || `Departamento "${name}" actualizado`); },
        error: (err) => { this.saving = false; this.snackbar.error(err.message || 'Error al actualizar departamento'); }
      });
    }
  }

  confirmDelete(dept: DepartmentDto) {
    this.departmentToDelete = dept;
    this.showDeleteModal = true;
  }

  deleteDepartment() {
    if (!this.departmentToDelete) return;
    this.deleting = true;
    this.departmentService.delete(this.departmentToDelete.id).subscribe({
      next: (res) => { this.showDeleteModal = false; this.deleting = false; this.loadDepartments(); this.snackbar.success(res.message || 'Departamento eliminado'); },
      error: (err) => { this.deleting = false; this.snackbar.error(err.message || 'Error al eliminar departamento'); }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadDepartments();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadDepartments();
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
