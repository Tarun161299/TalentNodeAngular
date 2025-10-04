import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-employee-signup',
 
  imports: [ FormsModule], 
   standalone: true,   // ✅ mark it standalone
  templateUrl: './employee-signup.html',
  styleUrls: ['./employee-signup.css']
})

export class EmployeeSignupComponent {
  name: string = '';
  email: string = '';
  contact: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordStrength: string = '';

  // Check password strength in real time
  checkPasswordStrength() {
    if (!this.password) {
      this.passwordStrength = '';
      return;
    }

    const strongRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$");
    const mediumRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{6,}$");

    if (strongRegex.test(this.password)) {
      this.passwordStrength = 'Strong';
    } else if (mediumRegex.test(this.password)) {
      if (this.passwordStrength !== 'Average') {
        alert("⚠️ Your password is Average. Consider making it stronger!");
      }
      this.passwordStrength = 'Average';
    } else {
      if (this.passwordStrength !== 'Weak') {
        alert("⚠️ Weak password! Please add uppercase, numbers & special characters.");
      }
      this.passwordStrength = 'Weak';
    }
  }

  // Real-time confirm password check
  checkPasswordMatch() {
    if (this.confirmPassword && this.password !== this.confirmPassword) {
      alert("❌ Password not matched!");
    }
  }

  // Final validation on submit
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert("❌ Password not matched!");
      return;
    }

    if (this.passwordStrength === 'Weak') {
      alert("⚠️ Weak password! Please use uppercase, number & special character.");
      return;
    }

    if (this.passwordStrength === 'Average') {
      alert("⚠️ Your password is Average. Consider making it stronger!");
      return;
    }

    alert(`✅ Signup successful!\nName: ${this.name}\nEmail: ${this.email}\nContact: ${this.contact}`);
  }
}
