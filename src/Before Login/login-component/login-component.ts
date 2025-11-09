import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../Common/services/login';
import { LoginDetails } from '../../Model/loginDetails';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../Common/services/loader-service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule   ,CommonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})


export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginDetails:LoginDetails|undefined;
  constructor(private fb: FormBuilder,private router: Router,private loginService:LoginService,private loaderService: LoaderService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
email_input:string="";
Password_input:string="";

  onLogin() {
    this.loaderService.hide()
    this.submitted = true;

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.loginDetails={
userName:this.loginForm.value.email,
password:this.loginForm.value.password
      };
    this.loginService.Authentication(this.loginDetails).subscribe({next:(response:any)=>{
      
      var token = response.token;
if(response!="401"){
  
 var role= this.getClaimsFromToken(token).Role_Id;
  localStorage.setItem('token',token);
  if(role.toString()=="3")
   this.router.navigate(['/welcome/dashboard']);
  else if(role.toString()=="4"){
    this.router.navigate(['/welcome/UserProfile']);
  }
  
else{
  alert("invalid role")
}
this.loaderService.hide()
}
    },error:(err:any)=>{

alert("invalid credentials")
this.loaderService.hide()
    }})
    
    } else {
      localStorage.clear();
      console.log('Form is invalid');
    }
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
onSignup() {

    // Navigate to Employee Signup page
    this.router.navigate(['/signup']);
  }
}
