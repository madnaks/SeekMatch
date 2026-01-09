import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { temporaryPasswordGuard } from './shared/guards/temporaryPasswordGuard.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [temporaryPasswordGuard]
    },
    {
        path: 'job',
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
        canActivate: [temporaryPasswordGuard]
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        canActivate: [authGuard, temporaryPasswordGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    { path: '**', redirectTo: '' }
];
