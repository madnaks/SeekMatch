import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'job',
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
        // canActivate: [authGuard]
    },
    {
        path: 'career-development',
        loadChildren: () => import('./career-development/career-development.module').then(m => m.CareerDevelopmentModule)
    },
    {
        path: 'cv',
        loadChildren: () => import('./cv/cv.module').then(m => m.CvModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    { path: '**', redirectTo: '' }
];
