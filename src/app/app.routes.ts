import { Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';
import { ExportDataComponent } from './export-data/export-data.component';

export const routes: Routes = [
    {
        path: "task",
        component: TaskComponent
    },
    {
        path: "export-data",
        component: ExportDataComponent
    },
];
