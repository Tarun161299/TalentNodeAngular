import { Component } from '@angular/core';
import { BeforLoginHeader } from '../befor-login-header/befor-login-header';
import { BeforeLoginFooter } from '../before-login-footer/before-login-footer';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login-component/login-component';

@Component({
  selector: 'app-before-login-component',
  imports: [RouterOutlet,BeforLoginHeader,BeforeLoginFooter,LoginComponent],
  templateUrl: './before-login-component.html',
  styleUrl: './before-login-component.css'
})
export class BeforeLoginComponent {

}
