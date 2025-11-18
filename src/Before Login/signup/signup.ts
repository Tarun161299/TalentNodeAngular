import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { SignupService } from '../../Common/services/signup';
import { SignupDetails } from '../../Model/SignupDetails';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmailService } from '../../Common/services/email-service';
import { LoaderService } from '../../Common/services/loader-service';

// Interface definitions
interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrengthResult {
  strength: number;
  requirements: PasswordRequirements;
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  isOpen = false;
emailmodal:string="";
  otpForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;

  signupdetails: SignupDetails | undefined;
  
  // Password requirements
  requirements: PasswordRequirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  // Password strength properties
  private strengthPercentage: number = 0;
  private passwordStrength: string = '';

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private toastr: ToastrService,
    private router: Router,
     private loader: LoaderService,
    private emailservice:EmailService
  ) {
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

        this.otpForm = this.fb.group({
      otp: [
        '', 
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(6),
          Validators.maxLength(6)
        ]
      ]
    });
  }
  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.otpForm.reset();
  }

  submit() {
    if (this.otpForm.invalid) return;
this.loader.show();
    var value = this.otpForm.value.otp;

        const formData = this.signupForm.value;
      // this.emailmodal=formData.email;
      this.signupdetails = {
        name: formData.name,
        email: formData.email, 
        phoneNumber: formData.contact,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        otp:value.toString()
      };

      this.signupService.signupEmployee(this.signupdetails).subscribe({
        next: (response) => {
        
         
this.toastr.success('Signup Successful!');
        
          
          this.resetForm();
          this.loader.hide();
        // Navigate to login page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']); // Adjust the route as per your login page route
        }, 2000);
      },
        error: (error) => {
          this.loader.hide();
          console.error('Signup error:', error);
          this.toastr.error('Signup failed! Please try again.', 'Error');
        }
      });

    // TODO: call API here

    this.close();
  }
  ngOnInit() {
    // Subscribe to password changes
    this.signupForm.controls['password'].valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
      this.updateRequirements(value);
      this.calculatePasswordStrength(value);
    });

    // Subscribe to confirm password changes
    this.signupForm.controls['confirmPassword'].valueChanges.subscribe(() => {
      this.validateForm();
    });
  }

  // Custom password strength validator
  private passwordStrengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const { strength } = this.checkPasswordStrength(value);
      
      if (strength < 60) {
        return { passwordStrength: true };
      }
      return null;
    };
  }

  // Password match validator
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Enhanced password strength checker
  private checkPasswordStrength(password: string): PasswordStrengthResult {
    let strength = 0;
    const requirements: PasswordRequirements = {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    };

    // Check length
    if (password.length >= 8) {
      strength += 20;
      requirements.length = true;
    }

    // Check uppercase
    if (/[A-Z]/.test(password)) {
      strength += 20;
      requirements.uppercase = true;
    }

    // Check lowercase
    if (/[a-z]/.test(password)) {
      strength += 20;
      requirements.lowercase = true;
    }

    // Check numbers
    if (/[0-9]/.test(password)) {
      strength += 20;
      requirements.number = true;
    }

    // Check special characters
    if (/[!@#$%^&*]/.test(password)) {
      strength += 20;
      requirements.special = true;
    }

    return { strength, requirements };
  }

  // Calculate and update password strength for UI
  private calculatePasswordStrength(password: string): void {
    if (!password) {
      this.strengthPercentage = 0;
      this.passwordStrength = '';
      return;
    }

    const { strength, requirements } = this.checkPasswordStrength(password);
    this.strengthPercentage = strength;

    // Update strength text
    if (strength <= 40) {
      this.passwordStrength = 'weak';
    } else if (strength <= 80) {
      this.passwordStrength = 'average';
    } else {
      this.passwordStrength = 'strong';
    }

    // Update requirements for UI
    this.requirements = requirements;
  }

  // Update requirements visibility
  private updateRequirements(password: string): void {
    if (!password) {
      Object.keys(this.requirements).forEach(key => {
        this.requirements[key as keyof PasswordRequirements] = false;
      });
      return;
    }

    this.requirements.length = password.length >= 8;
    this.requirements.uppercase = /[A-Z]/.test(password);
    this.requirements.lowercase = /[a-z]/.test(password);
    this.requirements.number = /[0-9]/.test(password);
    this.requirements.special = /[!@#$%^&*]/.test(password);
  }

  // Form validation
  private validateForm(): void {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    
    if (password && confirmPassword) {
      // Trigger validation updates
      this.signupForm.updateValueAndValidity();
    }
  }

  // Form control getters
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get contact() { return this.signupForm.get('contact'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  // Get password strength for UI (compatibility with existing template)
  getPasswordStrength(): string {
    return this.passwordStrength;
  }

  // Get strength percentage for progress bar (compatibility with existing template)
  getStrengthPercentage(): number {
    return this.strengthPercentage;
  }

  // Check if passwords match for UI
  passwordsMatch(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword;
  }

  // Check if passwords don't match for UI
  passwordsDontMatch(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword && this.confirmPassword?.touched;
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Check if requirement is met for UI
  isRequirementMet(requirement: keyof PasswordRequirements): boolean {
    return this.requirements[requirement];
  }

  // Form submission
  onSubmit(): void {
    if (this.signupForm.valid) {
      debugger
      this.loader.show();
     const formData = this.signupForm.value;
       this.emailmodal=formData.email;
       var emailsetting={
  email: this.emailmodal
}
this.emailservice.Sendemail(emailsetting).subscribe({next:(data:any)=>{
    if(data==333){
               this.toastr.warning('Already have an account with this email');
          }
  if(data==0){
    this.toastr.error("email is invalid !!")
  }
  if(data==1){
this.isOpen = true;
  }
  this.loader.hide();
},error:(err:any)=>{
     this.toastr.error("email is invalid !!"),
     this.loader.hide();
}})
    } else {
      this.showFormErrors();
    };
    
  }

  // Reset form after successful submission
  private resetForm(): void {
    this.signupForm.reset();
    this.passwordVisible = false;
    this.confirmPasswordVisible = false;
    this.strengthPercentage = 0;
    this.passwordStrength = '';
    
    // Reset requirements
    Object.keys(this.requirements).forEach(key => {
      this.requirements[key as keyof PasswordRequirements] = false;
    });
  }

  // Show appropriate error messages
  private showFormErrors(): void {
    if (this.signupForm.hasError('passwordMismatch')) {
      this.toastr.error('Passwords do not match!');
    } else if (this.password?.errors?.['required']) {
      this.toastr.warning('Password is required!');
    } else if (this.password?.errors?.['minlength']) {
      this.toastr.warning('Password must be at least 8 characters long!');
    } else if (this.password?.errors?.['passwordStrength']) {
      this.toastr.warning('Please use a stronger password with uppercase, numbers & special characters!');
    } else if (this.name?.errors?.['required']) {
      this.toastr.warning('Name is required!');
    } else if (this.email?.errors?.['required']) {
      this.toastr.warning('Email is required!');
    } else if (this.email?.errors?.['email']) {
      this.toastr.warning('Please enter a valid email address!');
    } else if (this.contact?.errors?.['required']) {
      this.toastr.warning('Contact number is required!');
    } else if (this.contact?.errors?.['pattern']) {
      this.toastr.warning('Please enter a valid 10-digit phone number!');
    } else {
      this.toastr.warning('Please fill all fields correctly!');
    }
  }

  // Helper method to check if form is submitting (for UI)
  isSubmitting: boolean = false;

  // Enhanced submit with loading state
  // async onSubmitWithLoading(): Promise<void> {
  //   if (this.signupForm.valid && !this.isSubmitting) {
  //     this.isSubmitting = true;
      
  //     try {
  //       const formData = this.signupForm.value;
        
  //       this.signupdetails = {
  //         name: formData.name,
  //         email: formData.email, 
  //         phoneNumber: formData.contact,
  //         password: formData.password,
  //         confirmPassword: formData.confirmPassword
  //       };

  //       await this.signupService.signupEmployee(this.signupdetails).toPromise();
  //       this.toastr.success('Signup Successful!');
  //       this.resetForm();
  //       // Navigate to login page after successful signup
  //     this.router.navigate(['/login']);
  //     } catch (error) {
  //       console.error('Signup error:', error);
  //       this.toastr.error('Signup failed! Please try again.', 'Error');
  //     } finally {
  //       this.isSubmitting = false;
  //     }
  //   } else {
  //     this.showFormErrors();
  //   }
  // }
}