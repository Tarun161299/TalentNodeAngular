import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface Education {
  degree: string;
  institution: string;
  year: number;
  percentage: number;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  currentPosition: string;
  currentCompany: string;
  expectedSalary: number;
  noticePeriod: number;
  avatar: string;
  resume: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: string[];
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  selectedTab = 'personal';

  user: UserProfile = {
    id: 1,
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    bio: 'Full-stack developer with 5+ years of experience in building scalable web applications. Passionate about React, Angular, and Node.js. Looking for challenging opportunities in product-based companies.',
    location: 'Bangalore, India',
    currentPosition: 'Senior Software Engineer',
    currentCompany: 'Tech Solutions Inc.',
    expectedSalary: 2500000,
    noticePeriod: 30,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    resume: '',
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Delhi',
        year: 2018,
        percentage: 85
      }
    ],
    experience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Software Engineer',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: 'Leading a team of 5 developers. Building scalable microservices architecture.'
      },
      {
        company: 'Digital Innovations',
        position: 'Software Developer',
        startDate: '2019-03',
        endDate: '2021-12',
        current: false,
        description: 'Developed and maintained multiple client projects using React and Node.js'
      }
    ],
    skills: [
      { name: 'Angular', level: 'Expert' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'MongoDB', level: 'Intermediate' }
    ],
    languages: ['English', 'Hindi'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aaravsharma',
      github: 'https://github.com/aaravsharma',
      portfolio: 'https://aaravsharma.dev'
    }
  };

  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit() {
    this.loadUserData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      personal: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
        location: ['', Validators.required],
        currentPosition: [''],
        currentCompany: [''],
        currentSalary: [''],
        expectedSalary: [0],
        noticePeriod: [0],
        bio: ['', [Validators.maxLength(1000)]]
      }),
      education: this.fb.array([]),
      experience: this.fb.array([]),
      skills: this.fb.array([]),
      socialLinks: this.fb.group({
        linkedin: [''],
        github: [''],
        portfolio: ['']
      })
    });
  }

  get educationForms() {
    return this.profileForm.get('education') as FormArray;
  }

  get experienceForms() {
    return this.profileForm.get('experience') as FormArray;
  }

  get skillForms() {
    return this.profileForm.get('skills') as FormArray;
  }

  addEducation() {
    const educationGroup = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1950)]],
      percentage: [0, [Validators.min(0), Validators.max(100)]]
    });
    this.educationForms.push(educationGroup);
  }

  removeEducation(index: number) {
    this.educationForms.removeAt(index);
  }

  addExperience() {
    const experienceGroup = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: ['']
    });
    this.experienceForms.push(experienceGroup);
  }

  removeExperience(index: number) {
    this.experienceForms.removeAt(index);
  }

  addSkill() {
    const skillGroup = this.fb.group({
      name: ['', Validators.required],
      level: ['Intermediate', Validators.required]
    });
    this.skillForms.push(skillGroup);
  }

  removeSkill(index: number) {
    this.skillForms.removeAt(index);
  }

  loadUserData() {
    // Personal Info
    this.profileForm.get('personal')?.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      location: this.user.location,
      currentPosition: this.user.currentPosition,
      currentCompany: this.user.currentCompany,
      expectedSalary: this.user.expectedSalary,
      noticePeriod: this.user.noticePeriod,
      bio: this.user.bio
    });

    // Education
    this.educationForms.clear();
    this.user.education.forEach(edu => {
      this.educationForms.push(this.fb.group(edu));
    });

    // Experience
    this.experienceForms.clear();
    this.user.experience.forEach(exp => {
      this.experienceForms.push(this.fb.group(exp));
    });

    // Skills
    this.skillForms.clear();
    this.user.skills.forEach(skill => {
      this.skillForms.push(this.fb.group(skill));
    });

    // Social Links
    this.profileForm.get('socialLinks')?.patchValue(this.user.socialLinks);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserData();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const formValue = this.profileForm.value;
        this.user = {
          ...this.user,
          ...formValue.personal,
          education: formValue.education,
          experience: formValue.experience,
          skills: formValue.skills,
          socialLinks: formValue.socialLinks
        };
        
        this.isLoading = false;
        this.isEditing = false;
        this.toastr.success('Profile updated successfully!', 'Success');
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fix the form errors before submitting.', 'Error');
    }
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('File size should be less than 5MB', 'Error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
        this.toastr.success('Profile picture updated!', 'Success');
      };
      reader.readAsDataURL(file);
    }
  }

  onResumeUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.toastr.error('Please upload a PDF file', 'Error');
        return;
      }
      
      this.user.resume = file.name;
      this.toastr.success('Resume uploaded successfully!', 'Success');
    }
  }

  getTotalExperience(): string {
    const experiences = this.user.experience;
    if (!experiences || experiences.length === 0) {
      return '0 years';
    }
    
    let totalMonths = 0;
    
    experiences.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
          totalMonths += Math.max(0, months);
        }
      }
    });
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (years === 0 && months === 0) return '0 years';
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
    
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  }

  getSkillLevelPercentage(level: string): number {
    switch(level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subKey => {
          control.get(subKey)?.markAsTouched();
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(subKey => {
              arrayControl.get(subKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }
}
