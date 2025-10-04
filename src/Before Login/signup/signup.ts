import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { SignupService } from '../../Common/services/signup';
import { SignupDetails } from '../../Model/SignupDetails';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-signup',
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;

  signupdetails:SignupDetails|undefined;
  
  // Password requirements
  requirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  constructor(private fb: FormBuilder,private signupService: SignupService,private toastr: ToastrService) {//
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Subscribe to password changes
    // Subscribe to password changes
    this.signupForm.controls['password'].valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
      this.updateRequirements(value);
    });
  }

  // Custom password strength validator
  passwordStrengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
        return { passwordStrength: true };
      }
      return null;
    };
  }

  // Password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Form control getters
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get contact() { return this.signupForm.get('contact'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  // Check password strength
  checkPasswordStrength(password: string) {
    if (!password) {
      this.signupForm.get('password')?.setErrors(null);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 8;

    // Update requirements
    this.requirements.length = isLongEnough;
    this.requirements.uppercase = hasUpperCase;
    this.requirements.lowercase = hasLowerCase;
    this.requirements.number = hasNumber;
    this.requirements.special = hasSpecial;

    // Calculate strength score
    const requirementsMet = Object.values(this.requirements).filter(Boolean).length;
    
    if (requirementsMet <= 2) {
      this.signupForm.get('password')?.setErrors({ weakPassword: true });
    } else if (requirementsMet <= 4) {
      this.signupForm.get('password')?.setErrors({ averagePassword: true });
    } else {
      this.signupForm.get('password')?.setErrors(null);
    }
  }

  // Update requirements visibility
  updateRequirements(password: string) {
    if (!password) {
      Object.keys(this.requirements).forEach(key => {
        this.requirements[key as keyof typeof this.requirements] = false;
      });
      return;
    }

    this.requirements.length = password.length >= 8;
    this.requirements.uppercase = /[A-Z]/.test(password);
    this.requirements.lowercase = /[a-z]/.test(password);
    this.requirements.number = /[0-9]/.test(password);
    this.requirements.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  // Get password strength for UI
  getPasswordStrength(): string {
    const requirementsMet = Object.values(this.requirements).filter(Boolean).length;
    
    if (requirementsMet <= 2) return 'weak';
    if (requirementsMet <= 4) return 'average';
    return 'strong';
  }

  // Get strength percentage for progress bar
  getStrengthPercentage(): number {
    const requirementsMet = Object.values(this.requirements).filter(Boolean).length;
    return (requirementsMet / 5) * 100;
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Form submission
  onSubmit() {
    if (this.signupForm.valid) {
      var formData = this.signupForm.value;
     // this.toastr.success('Signup successful!', 'Success');
      this.signupdetails={
         name  : formData.name,
         email : formData.email, 
         phoneNumber : formData.contact,
         password : formData.password,
         confirmPassword : formData.confirmPassword
   }
      this.signupService.signupEmployee(this.signupdetails).subscribe({
      next: (response) => {
        // Handle success
        debugger
         this.toastr.success('Signup Successfull');
        this.signupForm.reset();
      this.passwordVisible = false;
      this.confirmPasswordVisible = false;
        this.signupForm.reset();
      },
      error: (error) => {
        this.toastr.error('Signup failed!', 'Error');
        // Handle error
        }})
      
    } else {
      // Show specific error messages
      if (this.signupForm.hasError('passwordMismatch')) {
       this.toastr.error('Passwords do not match!');
      } else if (this.password?.errors?.['weakPassword']) {
        this.toastr.warning('Weak password! Please add uppercase, numbers & special characters.');
      } else if (this.password?.errors?.['averagePassword']) {
        this.toastr.warning('Your password is average. Consider making it stronger!');
      } else {
        this.toastr.warning('Please fill all fields correctly!');
      }
    }
  }
}