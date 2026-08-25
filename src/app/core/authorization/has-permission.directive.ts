import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Permission } from './permissions.enum';

@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective implements OnInit {
    private auth = inject(AuthService);
    private tpl = inject(TemplateRef);
    private vcr = inject(ViewContainerRef);

    @Input() hasPermission!: Permission;

    ngOnInit(): void {
        if (this.auth.hasPermission(this.hasPermission)) {
            this.vcr.createEmbeddedView(this.tpl);
        } else {
            this.vcr.clear();
        }
    }
}
