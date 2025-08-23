import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav-bar',
  imports: [CommonModule],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.css'
})
export class SideNavBar {
  // collapsed = false;
  constructor(private router: Router) {}
  // @Output() toggle = new EventEmitter<boolean>();

  // openMenu: string | null = null; // for nested nav

  // toggleSidebarWidth() {
  //   debugger
  //   this.collapsed = !this.collapsed;
  //   this.toggle.emit(this.collapsed);
  // }

  // toggleMenu(menu: string) {
  //   debugger
  //   this.openMenu = this.openMenu === menu ? null : menu;
  // }
  collapsed = false;
  openMenu: string | null = null;

  @Output() toggle = new EventEmitter<boolean>();

  toggleSidebarWidth() {
    this.collapsed = !this.collapsed;
    this.toggle.emit(this.collapsed);
  }

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  navigateTo(path: string) {
    debugger
    this.router.navigate([path]);
  }
}
