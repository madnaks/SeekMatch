import { Component } from "@angular/core";
import { BreadcrumbService } from "@app/shared/services/breadcrumb.service";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss'
})
export class BreadCrumbComponent {
    breadcrumbs: Array<{ label: string, url: string }> = [];

    constructor(private breadcrumbService: BreadcrumbService) { }

    ngOnInit(): void {
        this.breadcrumbs = this.breadcrumbService.breadcrumbs;
    }
}