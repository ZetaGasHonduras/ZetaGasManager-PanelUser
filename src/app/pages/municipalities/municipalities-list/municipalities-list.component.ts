import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../shared/components/ui/badge/badge.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { SearchableSelectComponent, SearchableOption } from '../../../shared/components/form/searchable-select/searchable-select.component';
import { MunicipalityService, MunicipalityDto } from '../../../core/services/municipality.service';
import { DepartmentService, DepartmentDto } from '../../../core/services/department.service';
import { HasPermissionDirective } from '../../../core/authorization/has-permission.directive';
import { Permission } from '../../../core/authorization/permissions.enum';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-municipalities-list',
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
  templateUrl: './municipalities-list.component.html',
  styles: ``
})
export class MunicipalitiesListComponent implements OnInit {
  private municipalityService = inject(MunicipalityService);
  private departmentService = inject(DepartmentService);
  private snackbar = inject(SnackbarService);

  municipalities: MunicipalityDto[] = [];
  departments: DepartmentDto[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading = false;
  error = '';
  searchTerm = '';

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedMunicipality: MunicipalityDto | null = null;
  saving = false;

  formName = '';
  formIneCode = '';
  formDepartmentId: string | number = '';

  showDeleteModal = false;
  municipalityToDelete: MunicipalityDto | null = null;
  deleting = false;

  Permission = Permission;

  get departmentOptions(): SearchableOption[] {
    return (this.departments ?? []).map(d => ({ value: d.id, label: d.name }));
  }

  ngOnInit() {
    this.loadMunicipalities();
    this.loadDepartments();
  }

  loadMunicipalities() {
    this.loading = true;
    this.error = '';
    this.municipalityService.getAll({ page: this.currentPage, per_page: this.pageSize, search: this.searchTerm || undefined }).subscribe({
      next: (res) => { this.municipalities = res.data; this.totalRecords = res.pagination.total; this.loading = false; },
      error: () => { this.error = 'Error al cargar municipios'; this.loading = false; }
    });
  }

  loadDepartments() {
    this.departmentService.getAll({ page: 1, per_page: 100 }).subscribe({
      next: (res) => { this.departments = res.data; },
      error: () => { this.departments = []; }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadMunicipalities();
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedMunicipality = null;
    this.formName = '';
    this.formIneCode = '';
    this.formDepartmentId = '';
    this.showModal = true;
  }

  openEditModal(muni: MunicipalityDto) {
    this.modalMode = 'edit';
    this.selectedMunicipality = muni;
    this.formName = muni.name;
    this.formIneCode = muni.ineCode;
    this.formDepartmentId = muni.department.id;
    this.showModal = true;
  }

  save() {
    if (!this.formName.trim() || !this.formIneCode.trim() || !this.formDepartmentId) return;
    this.saving = true;
    const name = this.formName.trim();
    const ineCode = this.formIneCode.trim();
    const departmentId = Number(this.formDepartmentId);
    const isCreate = this.modalMode === 'create';

    if (isCreate) {
      this.municipalityService.create({ departmentId, name, ineCode }).subscribe({
        next: (res) => { this.showModal = false; this.saving = false; this.loadMunicipalities(); this.snackbar.success(res.message || `Municipio "${name}" creado`); },
        error: (err) => { this.saving = false; this.snackbar.error(err.message || 'Error al crear municipio'); }
      });
    } else if (this.selectedMunicipality) {
      this.municipalityService.update(this.selectedMunicipality.id, { departmentId, name, ineCode }).subscribe({
        next: (res) => { this.showModal = false; this.saving = false; this.loadMunicipalities(); this.snackbar.success(res.message || `Municipio "${name}" actualizado`); },
        error: (err) => { this.saving = false; this.snackbar.error(err.message || 'Error al actualizar municipio'); }
      });
    }
  }

  confirmDelete(muni: MunicipalityDto) {
    this.municipalityToDelete = muni;
    this.showDeleteModal = true;
  }

  deleteMunicipality() {
    if (!this.municipalityToDelete) return;
    this.deleting = true;
    this.municipalityService.delete(this.municipalityToDelete.id).subscribe({
      next: (res) => { this.showDeleteModal = false; this.deleting = false; this.loadMunicipalities(); this.snackbar.success(res.message || 'Municipio eliminado'); },
      error: (err) => { this.deleting = false; this.snackbar.error(err.message || 'Error al eliminar municipio'); }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadMunicipalities();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadMunicipalities();
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
