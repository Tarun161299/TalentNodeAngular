import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,RouterModule} from '@angular/router';
import { LoginService } from '../../Common/services/login';
import { LoginDetails } from '../../Model/loginDetails';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../Common/services/loader-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})


export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginDetails:LoginDetails|undefined;
  constructor(private fb: FormBuilder,
    private router: Router,
    private loginService:LoginService,
    private loaderService: LoaderService,
    private loader:LoaderService,
    private toastr:ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
email_input:string="";
Password_input:string="";

  onLogin() {
    
    this.submitted = true;

    if (this.loginForm.valid) {
      this.loader.show();
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.loginDetails={
userName:this.loginForm.value.email,
password:this.loginForm.value.password
      };
    this.loginService.Authentication(this.loginDetails).subscribe({next:(response:any)=>{
      debugger
      var token = response.token;
if(response.token!="401"){
  
 var role= this.getClaimsFromToken(token).Role_Id;
  localStorage.setItem('token',token);
  if(role.toString()=="3")
   this.router.navigate(['/welcome/dashboard']);
  else if(role.toString()=="4"){
    this.router.navigate(['/welcome/dashboard']);
  }
  
else{
  this.toastr.error("Invalid role")
}
this.loader.hide()
}
else{
  this.toastr.error("Invalid Email Or Password")
  this.loader.hide()
}
    },error:(err:any)=>{

this.toastr.error("invalid credentials")
this.loader.hide()
    }})
    
    } else {
      localStorage.clear();
      console.log('Form is invalid');
    }
  }
showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
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
