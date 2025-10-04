import { Component } from '@angular/core';
import { BeforLoginHeader } from '../befor-login-header/befor-login-header';
import { BeforeLoginFooter } from '../before-login-footer/before-login-footer';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login-component/login-component';
import { EmployeeSignupComponent } from '../employee-signup/employee-signup';
import { Signup } from '../signup/signup';

@Component({
  selector: 'app-before-login-component',
  imports: [RouterOutlet,BeforLoginHeader,BeforeLoginFooter,LoginComponent,Signup],
  templateUrl: './before-login-component.html',
  styleUrl: './before-login-component.css'
})
export class BeforeLoginComponent {

}
