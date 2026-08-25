import { Permission } from './permissions.enum';

export interface PermissionItem {
    id: string;
    name: string;
}

export const Permissions = {
    Items: [
        { id: Permission.CanViewUsers, name: 'Ver usuarios' },
        { id: Permission.CanCreateUsers, name: 'Crear usuarios' },
        { id: Permission.CanEditUsers, name: 'Editar usuarios' },
        { id: Permission.CanDeleteUsers, name: 'Eliminar usuarios' },
        { id: Permission.CanViewRoles, name: 'Ver roles' },
        { id: Permission.CanCreateRoles, name: 'Crear roles' },
        { id: Permission.CanEditRoles, name: 'Editar roles' },
        { id: Permission.CanDeleteRoles, name: 'Eliminar roles' },
    ] as PermissionItem[]
};
