import { Component } from '@angular/core';
import { AfterLoginFooter } from '../after-login-footer/after-login-footer';
import { AfterLoginHeader } from '../after-login-header/after-login-header';
import { RouterOutlet } from '@angular/router';
import { SideNavBar } from '../side-nav-bar/side-nav-bar';
import { Dashboard } from '../dashboard/dashboard';
import { AllApplication } from '../all-application/all-application';

@Component({
  selector: 'app-after-login-component',
  imports: [RouterOutlet,AfterLoginFooter,AfterLoginHeader,SideNavBar,Dashboard,AllApplication],
  templateUrl: './after-login-component.html',
  styleUrl: './after-login-component.css'
})
export class AfterLoginComponent {
  isSidebarCollapsed = false;

  onSidebarToggled(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
