import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { authGuard } from './guards/auth.guard';
import { AdminLoginComponent } from './components/admin/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'company-profile', 
    component: CompanyProfileComponent,
    canActivate: [authGuard],
    data: { requiredType: 'company' }
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  { 
    path: 'user-profile', 
    component: UserProfileComponent,
    canActivate: [authGuard],
    data: { requiredType: 'user' }
  },
  { 
    path: 'company/:id', 
    component: CompanyDetailsComponent 
  },
  // Ajouter d'autres routes protégées ici
];
