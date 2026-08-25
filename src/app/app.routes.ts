import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { RolesListComponent } from './pages/roles/roles-list/roles-list.component';
import { RolesFormComponent } from './pages/roles/roles-form/roles-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { Permission } from './core/authorization/permissions.enum';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    canActivate: [authGuard],
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'ZetaGas Manager - Dashboard',
      },
      {
        path:'calendar',
        component:CalenderComponent,
        title:'ZetaGas Manager - Calendario'
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'ZetaGas Manager - Formularios'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'ZetaGas Manager - Tablas'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'ZetaGas Manager - Blank'
      },
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'ZetaGas Manager - Facturas'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'ZetaGas Manager - Gráfico de Líneas'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'ZetaGas Manager - Gráfico de Barras'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'ZetaGas Manager - Alerts'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'ZetaGas Manager - Avatars'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'ZetaGas Manager - Badges'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'ZetaGas Manager - Buttons'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'ZetaGas Manager - Images'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'ZetaGas Manager - Videos'
      },
      // Roles
      {
        path: 'roles',
        component: RolesListComponent,
        canActivate: [permissionGuard(Permission.CanViewRoles)],
        title: 'ZetaGas Manager - Roles',
      },
      {
        path: 'roles/create',
        component: RolesFormComponent,
        canActivate: [permissionGuard(Permission.CanCreateRoles)],
        title: 'ZetaGas Manager - Crear Rol',
      },
      {
        path: 'roles/edit/:id',
        component: RolesFormComponent,
        canActivate: [permissionGuard(Permission.CanEditRoles)],
        title: 'ZetaGas Manager - Editar Rol',
      },
      // Users
      {
        path: 'users',
        component: UsersListComponent,
        canActivate: [permissionGuard(Permission.CanViewUsers)],
        title: 'ZetaGas Manager - Usuarios',
      },
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'ZetaGas Manager - Iniciar Sesión'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'ZetaGas Manager - Registrarse'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'ZetaGas Manager - 404'
  },
];
