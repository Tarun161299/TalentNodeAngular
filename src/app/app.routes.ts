import { Routes } from '@angular/router';
//import { LoginComponent } from '../Before Login/login-component/login-component';
import { BeforeLoginComponent } from '../Before Login/before-login-component/before-login-component';
import { LoginComponent } from '../Before Login/login-component/login-component';
import { AfterLoginComponent } from '../After Login/after-login-component/after-login-component';
import { Dashboard } from '../After Login/dashboard/dashboard';
import { AllApplication } from '../After Login/all-application/all-application';

export const routes: Routes = [
   {
    path: '',
    component: BeforeLoginComponent,
    children: [
      { path: '', component: LoginComponent }, // default
      { path: 'login', component: LoginComponent }
    ]
    
  },{
    
     path: 'welcome',
    component: AfterLoginComponent,
    children: [
      { path: 'dashboard', component: Dashboard , pathMatch: 'full'}, // default
      { path: 'all_Application', component: AllApplication , pathMatch: 'full'}, // default   
    ]
  },
  { path: '**', redirectTo: '' }
];
