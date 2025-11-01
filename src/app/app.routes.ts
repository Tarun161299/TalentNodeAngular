import { Routes } from '@angular/router';
//import { LoginComponent } from '../Before Login/login-component/login-component';
import { BeforeLoginComponent } from '../Before Login/before-login-component/before-login-component';
import { LoginComponent } from '../Before Login/login-component/login-component';
import { AfterLoginComponent } from '../After Login/after-login-component/after-login-component';
import { Dashboard } from '../After Login/dashboard/dashboard';
import { AllApplication } from '../After Login/all-application/all-application';
import { CandidateDashboard } from './candidate-dashboard/candidate-dashboard';
import { EmployeeSignupComponent } from '../Before Login/employee-signup/employee-signup';
import { Signup } from '../Before Login/signup/signup';
import { UserProfileComponent } from '../After Login/user-profile/user-profile';
import { JobList } from '../After Login/job-list/job-list';
import { UserJoblist } from '../After Login/user-joblist/user-joblist';

import { CreateJobComponent } from '../After Login/create-job-component/create-job-component';



export const routes: Routes = [
   {
    path: '',
    component: BeforeLoginComponent,
    children: [
      { path: '', component: LoginComponent }, // default
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: Signup,pathMatch: 'full'},
      

    ]
    
  },{
    
     path: 'welcome',
    component: AfterLoginComponent,
    children: [
      { path: 'dashboard', component: Dashboard , pathMatch: 'full'}, // default
      { path: 'all_application', component: AllApplication }, // default 
      { path: 'CandidateDashboard', component: CandidateDashboard , pathMatch: 'full'},   
       {path: 'UserProfile',component:UserProfileComponent} ,
       {path: 'job-list',component:JobList},
      {path: 'user-joblist',component:UserJoblist},
       {path: 'CreateJob',component:CreateJobComponent} 
    ]
  },
  { path: '**', redirectTo: '' }
];
