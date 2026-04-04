import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-befor-login-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './befor-login-header.html',
  styleUrl: './befor-login-header.css'
})
export class BeforLoginHeader {
  mobileMenuOpen = false;

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
