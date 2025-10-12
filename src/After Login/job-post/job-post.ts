import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Interface definitions
interface JobBenefits {
  health: boolean;
  dental: boolean;
  retirement: boolean;
  remote: boolean;
  training: boolean;
  flexible: boolean;
}

interface JobFormData {
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string;
  benefits: JobBenefits;
  deadline: string;
  vacancies: number;
}

interface Department {
  value: string;
  label: string;
}

interface JobType {
  value: string;
  label: string;
}

interface ExperienceLevel {
  value: string;
  label: string;
}

@Component({
  selector: 'app-job-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-post.html',
  styleUrl: './job-post.css'
})
export class JobPostComponent implements OnInit {
  jobForm: FormGroup;
  showPreview = false;
  notification = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  };

  // Form options
  departments: Department[] = [
    { value: '', label: 'Select Department' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'design', label: 'Design' }
  ];

  jobTypes: JobType[] = [
    { value: '', label: 'Select Job Type' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  experienceLevels: ExperienceLevel[] = [
    { value: '', label: 'Select Experience' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  constructor(private fb: FormBuilder) {
    this.jobForm = this.createForm();
  }

  ngOnInit(): void {
    // Any initialization logic here
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      department: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      salary: [''],
      experience: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      requirements: ['', [Validators.required, Validators.minLength(50)]],
      benefits: this.fb.group({
        health: [false],
        dental: [false],
        retirement: [false],
        remote: [false],
        training: [false],
        flexible: [false]
      }),
      deadline: [''],
      vacancies: [1, [Validators.min(1)]]
    });
  }

  // Get minimum date for deadline (tomorrow)
  get minDeadlineDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Form submission
  onSubmit(): void {
    if (this.jobForm.valid) {
      const jobData: JobFormData = this.jobForm.value;
      console.log('Job Posted:', jobData);
      
      this.showNotification('Job posted successfully!', 'success');
      this.resetForm();
      this.showPreview = false;
    } else {
      this.markFormGroupTouched();
      this.showNotification('Please fill in all required fields correctly.', 'error');
    }
  }

  // Preview functionality
  onPreview(): void {
    if (this.jobForm.valid) {
      this.showPreview = true;
      // Scroll to preview section
      setTimeout(() => {
        const previewElement = document.querySelector('.preview-card');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      this.markFormGroupTouched();
      this.showNotification('Please fill in all required fields to preview.', 'error');
    }
  }

  // Save as draft
  onSaveDraft(): void {
    const jobData: JobFormData = this.jobForm.value;
    console.log('Draft Saved:', jobData);
    this.showNotification('Job saved as draft successfully!', 'info');
  }

  // Mark all form fields as touched to show validation errors
  private markFormGroupTouched(): void {
    Object.keys(this.jobForm.controls).forEach(key => {
      const control = this.jobForm.get(key);
      if (control instanceof FormGroup) {
        this.markNestedFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private markNestedFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Reset form
  private resetForm(): void {
    this.jobForm.reset({
      benefits: {
        health: false,
        dental: false,
        retirement: false,
        remote: false,
        training: false,
        flexible: false
      },
      vacancies: 1
    });
  }

  // Show notification
  showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.notification = {
      show: true,
      message,
      type
    };

    setTimeout(() => {
      this.notification.show = false;
    }, 4000);
  }

  // Check if any benefits are selected
  hasBenefits(): boolean {
    const benefits = this.jobForm.get('benefits')?.value;
    return benefits ? Object.values(benefits).some((value: any) => value === true) : false;
  }

  // Format text for display (capitalize, replace hyphens, etc.)
  formatText(text: string): string {
    if (!text) return '';
    
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Convenience getters for form controls
  get title() { return this.jobForm.get('title'); }
  get department() { return this.jobForm.get('department'); }
  get type() { return this.jobForm.get('type'); }
  get location() { return this.jobForm.get('location'); }
  get experience() { return this.jobForm.get('experience'); }
  get description() { return this.jobForm.get('description'); }
  get requirements() { return this.jobForm.get('requirements'); }
  get vacancies() { return this.jobForm.get('vacancies'); }
  get benefits() { return this.jobForm.get('benefits'); }
}