import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface TableColumn<T> {
    field: string;
    header: string;
    type: 'text' | 'date' | 'number' | 'enum';
    sortable?: boolean;
    formatter?: ((value: any, row?: T) => string); 
    badgeClass?: (value: any, row?: T) => string;
}

export interface TableAction<T> {
    icon: string;
    tooltip: string;
    onClick: (row: T) => void;
}

@Component({
    selector: 'be-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class DataTableComponent<T extends { [key: string]: any }> {
    @Input() data: T[] = [];
    @Input() columns: TableColumn<T>[] = [];
    @Input() actions: TableAction<T>[] = [];
    @Input() hasColumnCounter: boolean = false;

    @Output() rowClicked: EventEmitter<T> = new EventEmitter<T>();

    sortedData: T[] = [];
    sortColumn: keyof T | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';

    ngOnChanges() {
        this.sortedData = [...this.data];
    }

    public sortData(column: keyof T) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.sortedData = [...this.data].sort((a, b) => {
            const valueA = a[column];
            const valueB = b[column];
            if (valueA == null || valueB == null) return 0;

            let comparison = 0;

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                comparison = valueA.localeCompare(valueB);
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                comparison = valueA - valueB;
            } else {
                comparison = String(valueA).localeCompare(String(valueB));
            }

            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    public getValue(row: any, field: string) {
        return field.split('.').reduce((acc, part) => acc && acc[part], row);
    }

    public onRowClicked(row: T): void {
        this.rowClicked.emit(row);
    }

}
