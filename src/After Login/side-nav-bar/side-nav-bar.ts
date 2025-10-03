import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleServices } from '../../Common/services/module-services';

@Component({
  selector: 'app-side-nav-bar',
  imports: [CommonModule],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.css'
})
export class SideNavBar {
  // collapsed = false;
  constructor(private router: Router,private moduleServices:ModuleServices) {}
  // @Output() toggle = new EventEmitter<boolean>();
  modulesData:any;

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
ngOnInit(): void {
  debugger
  // This code runs when the page/component loads
var token=localStorage.getItem('token');
this.getClaimsFromToken(token==null|| token==undefined ?"":token).Role_Id
  console.log('Page loaded!');
  this.moduleServices.GetModuleById(this.getClaimsFromToken(token==null|| token==undefined ?"":token).Role_Id).subscribe({next:(data:any)=>{
   debugger
    this.modulesData=data;
  },
error:(error:any)=>{
  alert("some error occured")
}})
  // this.loadAllEmployeeData();
}
  toggleSidebarWidth() {
    this.collapsed = !this.collapsed;
    this.toggle.emit(this.collapsed);
  }

  toggleMenu(menu: string) {
    debugger
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  navigateTo(path: string) {
    debugger
    this.router.navigate([path]);
  }

    getClaimsFromToken(token: string): any {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];  // JWT = header.payload.signature
    const decoded = atob(payload);        // Base64 decode
    return JSON.parse(decoded);           // Convert to JSON
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}
}
