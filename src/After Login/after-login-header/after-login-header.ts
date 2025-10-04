import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-after-login-header',
  imports: [],
  templateUrl: './after-login-header.html',
  styleUrl: './after-login-header.css'
})
export class AfterLoginHeader {
  UserName:string|undefined;
  RoleName:string|undefined;
  constructor(private router: Router,){

  }
ngOnInit(): void {
var token = localStorage.getItem('token');

this.UserName= this.getClaimsFromToken(token==null || token==undefined ?"":token).UserName;
this.RoleName= this.getClaimsFromToken(token==null || token==undefined ?"":token).role;
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

Logout(){
  localStorage.clear();
this.router.navigate(['/'])
}
}
