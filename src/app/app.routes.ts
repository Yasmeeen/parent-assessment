import { Routes } from '@angular/router';
import { LoginComponent } from './main/login/login.component';
import { MainComponent } from './main/main.component';
import { UsersListComponent } from './main/users-list/users-list.component';
import { AuthGuard } from './core/auth/guards/authentication.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./main/users-list/users-list.component').then((m) => m.UsersListComponent),
        canActivate: [AuthGuard]
      },

      // Add more routes for other standalone components
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }, // Fallback route

];
