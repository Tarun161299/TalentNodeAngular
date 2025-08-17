import { Component } from '@angular/core';
import { AfterLoginFooter } from '../after-login-footer/after-login-footer';
import { AfterLoginHeader } from '../after-login-header/after-login-header';
import { RouterOutlet } from '@angular/router';
import { SideNavBar } from '../side-nav-bar/side-nav-bar';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-after-login-component',
  imports: [RouterOutlet,AfterLoginFooter,AfterLoginHeader,SideNavBar,Dashboard],
  templateUrl: './after-login-component.html',
  styleUrl: './after-login-component.css'
})
export class AfterLoginComponent {

}
