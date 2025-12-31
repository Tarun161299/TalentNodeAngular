import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../Common/services/employee-service';
import { Employee } from '../../Model/AddProfile';
import { MasterServices } from '../../Common/services/master-services';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Imageupload } from '../../Common/services/imageupload';
import { LoaderService } from '../../Common/services/loader-service';

interface Education {
  degEmpId: number;
  degree: number;
  institution: string;
  year: number;
  percentage: number;
}

interface Experience {
  employeeID: number;
  experienceId: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  skillEmpId: number;
  name: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface KeySkill {
  keySkillEmpId: number;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Project {
  projectEmpId: number;
  name: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
  description: string;
  technologies: string;
  url: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  currentSalary: number
  location: string;
  currentPosition: string;
  currentCompany: string;
  expectedSalary: number;
  noticePeriod: number;
  avatar: string;
  resume: string;
  stateid: Number;
  districtId: Number;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  keySkills: KeySkill[];
  projects: Project[];
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PdfViewerModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  showPdf = false;
  isResumeUploaded: boolean = false;
  skillemployee: any;
  keySkills: any;
  selectedTab = 'personal';
  degree: any;
  empId: number = 0;
  disticts: any;
  showP: string = '';
  states: any;
  empProfile: Employee | undefined;
  
  // Store form values before editing to detect changes
  originalFormValues: any = {};

  user: UserProfile = {
    id: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    currentPosition: '',
    currentCompany: '',
    expectedSalary: 0,
    currentSalary: 0,
    stateid: 0,
    districtId: 0,
    noticePeriod: 30,
    avatar: '',
    resume: '',
    education: [
      {
        degEmpId: 0,
        degree: 0,
        institution: '',
        year: 2018,
        percentage: 85
      }
    ],
    experience: [
      {
        employeeID: 0,
        experienceId: 0,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: true,
        description: ''
      }
    ],
    skills: [],
    keySkills: [],
    projects: [],
    languages: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  };

  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  proficiencyLevels = ['Basic', 'Intermediate', 'Advanced', 'Expert'];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private masterServices: MasterServices,
    private imageperofile: Imageupload,
    private loader: LoaderService
  ) {
    this.showP = this.imageperofile.base64String();
    this.profileForm = this.createForm();
  }

  closeModal() {
    this.showPdf = false;
  }

  ngOnInit() {
    this.loader.show();
    const token = localStorage.getItem('token');
    
    if (!this.isEditing) {
      this.profileForm.get('personal.State')?.disable();
      this.profileForm.get('personal.District')?.disable();
    }
    
    this.empId = Number(this.getClaimsFromToken(token == null || token == undefined ? "" : token).EmpId);
    this.profileForm = this.createForm();
    this.loadUserData();
    this.getAllDistricts();
    this.getAllStates();
    this.getAllQual();
    this.getAllSkills();
    this.getAllKeySkills();
    this.GetUserDetailsById(this.empId);
  }

  viewResume() {
    if (this.user.resume) {
      this.showPdf = true;
    } else {
      this.toastr.warning('No resume uploaded yet', 'Info');
    }
  }

  GetUserDetailsById(id: number) {
    this.employeeService.getEmployeedetailsById(id).subscribe({
      next: (data: any) => {
        this.loader.hide();
        this.user = data;
        this.user.avatar = (data.avatar == null || data.avatar == undefined || data.avatar == '') 
          ? `data:image/png;base64,${this.showP}` 
          : `data:image/jpeg;base64,${data.avatar}`;
        
        this.isResumeUploaded = !!(data.resume && data.resume !== '');
        
        this.profileForm.get('personal')?.patchValue({
          firstName: this.user.firstName ?? '',
          lastName: this.user.lastName ?? '',
          email: this.user.email ?? '',
          phone: this.user.phone ?? '',
          location: this.user.location ?? '',
          stateid: this.user.stateid ?? '',
          districtId: this.user.districtId ?? '',
          currentPosition: this.user.currentPosition ?? '',
          currentCompany: this.user.currentCompany ?? '',
          currentSalary: this.user.currentSalary ?? '',
          expectedSalary: this.user.expectedSalary ?? 0,
          noticePeriod: this.user.noticePeriod ?? 0,
          bio: this.user.bio ?? ''
        });

        this.profileForm.get('socialLinks')?.patchValue({
          linkedin: this.user.socialLinks?.linkedin ?? '',
          github: this.user.socialLinks?.github ?? '',
          portfolio: this.user.socialLinks?.portfolio ?? ''
        });

        this.setFormArray('education', this.user.education);
        this.setFormArray('experience', this.user.experience);
        this.setFormArray('skills', this.user.skills);
        this.setFormArray('keySkills', this.user.keySkills);
        this.setFormArray('projects', this.user.projects);
        
        // Store original values when data is loaded
        this.storeOriginalValues();
      }, 
      error: (err: any) => {
        this.loader.hide();
        this.toastr.error('Failed to load user data', 'Error');
      }
    });
  }

  getClaimsFromToken(token: string): any {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  setFormArray(arrayName: string, data: any[]) {
    const formArray = this.profileForm.get(arrayName) as FormArray;
    formArray.clear();
    if (!data || !data.length) return;
    data.forEach(item => {
      formArray.push(this.fb.group({ ...item }));
    });
  }

  getAllStates() {
    this.masterServices.GetAllState().subscribe({
      next: (data: any) => {
        this.states = data;
      }, 
      error: (err: any) => {
        this.toastr.error('Failed to load states', 'Error');
      }
    });
  }

  getAllQual() {
    this.masterServices.GetAllQualification().subscribe({
      next: (data: any) => {
        this.degree = data;
      }, 
      error: (err: any) => {
        this.toastr.error('Failed to load qualifications', 'Error');
      }
    });
  }

  getAllSkills() {
    this.masterServices.GetAllSkill().subscribe({
      next: (data: any) => {
        this.skillemployee = data;
      }, 
      error: (err: any) => {
        this.toastr.error('Failed to load skills', 'Error');
      }
    });
  }

  getAllKeySkills() {
    this.masterServices.GetAllKeySkill().subscribe({
      next: (data: any) => {
        this.keySkills = data;
      }, 
      error: (err: any) => {
        this.toastr.error('Failed to load key skills', 'Error');
      }
    });
  }

  getAllDistricts() {
    this.masterServices.GetAllDistrict().subscribe({
      next: (data: any) => {
        this.disticts = data;
      }, 
      error: (err: any) => {
        this.toastr.error('Failed to load districts', 'Error');
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      personal: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
        location: ['', Validators.required],
        districtId: ['', Validators.required],
        stateid: ['', Validators.required],
        currentPosition: [''],
        currentCompany: [''],
        currentSalary: ['', [Validators.min(0)]],
        expectedSalary: [0, [Validators.min(0)]],
        noticePeriod: [0, [Validators.min(0), Validators.max(365)]],
        bio: ['', [Validators.maxLength(1000)]]
      }),
      education: this.fb.array([]),
      experience: this.fb.array([]),
      skills: this.fb.array([]),
      keySkills: this.fb.array([]),
      projects: this.fb.array([]),
      socialLinks: this.fb.group({
        linkedin: [''],
        github: [''],
        portfolio: ['']
      })
    });
  }

  // Form Array Getters
  get educationForms() {
    return this.profileForm.get('education') as FormArray;
  }

  get experienceForms() {
    return this.profileForm.get('experience') as FormArray;
  }

  get skillForms() {
    return this.profileForm.get('skills') as FormArray;
  }

  get keySkillForms() {
    return this.profileForm.get('keySkills') as FormArray;
  }

  get projectForms() {
    return this.profileForm.get('projects') as FormArray;
  }

  // Store original form values when entering edit mode
  storeOriginalValues() {
    this.originalFormValues = {
      personal: { ...this.profileForm.get('personal')?.value },
      education: this.educationForms.value.map((item: any) => ({ ...item })),
      experience: this.experienceForms.value.map((item: any) => ({ ...item })),
      skills: this.skillForms.value.map((item: any) => ({ ...item })),
      keySkills: this.keySkillForms.value.map((item: any) => ({ ...item })),
      projects: this.projectForms.value.map((item: any) => ({ ...item }))
    };
  }

  // Check if current tab has changes
  hasCurrentTabChanges(): boolean {
    if (!this.isEditing) return false;

    switch (this.selectedTab) {
      case 'personal':
        return this.hasObjectChanged(
          this.originalFormValues.personal, 
          this.profileForm.get('personal')?.value
        );
      
      case 'experience':
        return this.hasArrayChanged(
          this.originalFormValues.experience,
          this.experienceForms.value
        );
      
      case 'education':
        return this.hasArrayChanged(
          this.originalFormValues.education,
          this.educationForms.value
        );
      
      case 'skills':
        return this.hasArrayChanged(
          this.originalFormValues.skills,
          this.skillForms.value
        );
      
      case 'key-skills':
        return this.hasArrayChanged(
          this.originalFormValues.keySkills,
          this.keySkillForms.value
        );
      
      case 'projects':
        return this.hasArrayChanged(
          this.originalFormValues.projects,
          this.projectForms.value
        );
      
      default:
        return false;
    }
  }

  // Check if current tab form is valid
  isCurrentTabValid(): boolean {
    switch (this.selectedTab) {
      case 'personal':
        return this.profileForm.get('personal')?.valid || false;
      
      case 'experience':
        // Check if experience array has at least one item and all items are valid
        if (this.experienceForms.length === 0) {
          return false; // No experience entries
        }
        
        // Check each experience entry
        for (let i = 0; i < this.experienceForms.length; i++) {
          const experienceGroup = this.experienceForms.at(i) as FormGroup;
          
          // Check required fields
          if (!experienceGroup.get('company')?.value?.trim() || 
              !experienceGroup.get('position')?.value?.trim() ||
              !experienceGroup.get('startDate')?.value) {
            return false;
          }
          
          // If not current, end date is required
          if (!experienceGroup.get('current')?.value && !experienceGroup.get('endDate')?.value) {
            return false;
          }
        }
        return true;
      
      case 'education':
        // Check if education array has at least one item and all items are valid
        if (this.educationForms.length === 0) {
          return false;
        }
        
        for (let i = 0; i < this.educationForms.length; i++) {
          const educationGroup = this.educationForms.at(i) as FormGroup;
          
          if (!educationGroup.get('degree')?.value || 
              !educationGroup.get('institution')?.value?.trim() ||
              !educationGroup.get('year')?.value) {
            return false;
          }
        }
        return true;
      
      case 'skills':
        // Check if skills array has at least one item and all items are valid
        if (this.skillForms.length === 0) {
          return false;
        }
        
        for (let i = 0; i < this.skillForms.length; i++) {
          const skillGroup = this.skillForms.at(i) as FormGroup;
          
          if (!skillGroup.get('name')?.value || !skillGroup.get('level')?.value) {
            return false;
          }
        }
        return true;
      
      case 'key-skills':
        // Check if keySkills array has at least one item and all items are valid
        if (this.keySkillForms.length === 0) {
          return false;
        }
        
        for (let i = 0; i < this.keySkillForms.length; i++) {
          const keySkillGroup = this.keySkillForms.at(i) as FormGroup;
          
          if (!keySkillGroup.get('keySkillId')?.value || !keySkillGroup.get('level')?.value) {
            return false;
          }
        }
        return true;
      
      case 'projects':
        // Check if projects array has at least one item and all items are valid
        if (this.projectForms.length === 0) {
          return false;
        }
        
        for (let i = 0; i < this.projectForms.length; i++) {
          const projectGroup = this.projectForms.at(i) as FormGroup;
          
          if (!projectGroup.get('name')?.value?.trim() ||
              !projectGroup.get('startDate')?.value ||
              !projectGroup.get('description')?.value?.trim()) {
            return false;
          }
          
          // If not ongoing, end date is required
          if (!projectGroup.get('ongoing')?.value && !projectGroup.get('endDate')?.value) {
            return false;
          }
        }
        return true;
      
      default:
        return false;
    }
  }

  // Show submit button only if editing, current tab has changes, and current tab is valid
  shouldShowSubmitButton(): boolean {
    return this.isEditing && this.hasCurrentTabChanges() && this.isCurrentTabValid();
  }

  // Helper method to compare objects
  private hasObjectChanged(original: any, current: any): boolean {
    if (!original || !current) return true;
    
    return JSON.stringify(original) !== JSON.stringify(current);
  }

  // Helper method to compare arrays
  private hasArrayChanged(original: any[], current: any[]): boolean {
    if (!original || !current) return true;
    if (original.length !== current.length) return true;
    
    return JSON.stringify(original) !== JSON.stringify(current);
  }

  // Education Methods
  addEducation() {
    const educationGroup = this.fb.group({
      degEmpId: [this.empId],
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

  // Experience Methods
  addExperience() {
    const experienceGroup = this.fb.group({
      employeeID: [this.empId],
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      experienceId: [0],
      current: [false],
      description: ['']
    });
    
    // Add validation logic for end date when current is false
    experienceGroup.get('current')?.valueChanges.subscribe(isCurrent => {
      const endDateCtrl = experienceGroup.get('endDate');
      if (isCurrent) {
        endDateCtrl?.clearValidators();
        endDateCtrl?.setValue('');
      } else {
        endDateCtrl?.setValidators(Validators.required);
      }
      endDateCtrl?.updateValueAndValidity();
    });
    
    this.experienceForms.push(experienceGroup);
  }

  removeExperience(index: number) {
    this.experienceForms.removeAt(index);
  }

  // Skills Methods
  addSkill() {
    const skillGroup = this.fb.group({
      skillEmpId: [this.empId],
      name: ['', Validators.required],
      level: ['Intermediate', Validators.required]
    });
    this.skillForms.push(skillGroup);
  }

  removeSkill(index: number) {
    this.skillForms.removeAt(index);
  }

  // Key Skills Methods
  addKeySkill() {
    const keySkillGroup = this.fb.group({
      empId: [this.empId],
      keySkillId: ['', Validators.required],
      level: ['', Validators.required]
    });
    this.keySkillForms.push(keySkillGroup);
  }

  removeKeySkill(index: number) {
    this.keySkillForms.removeAt(index);
  }

  // Projects Methods
  addProject() {
    const projectGroup = this.fb.group({
      projectEmpId: [this.empId],
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      ongoing: [false],
      description: ['', Validators.required],
      technologies: [''],
      url: ['']
    });

    projectGroup.get('ongoing')?.valueChanges.subscribe(isOngoing => {
      const endDateCtrl = projectGroup.get('endDate');
      if (isOngoing) {
        endDateCtrl?.clearValidators();
        endDateCtrl?.setValue('');
      } else {
        endDateCtrl?.setValidators(Validators.required);
      }
      endDateCtrl?.updateValueAndValidity();
    });

    this.projectForms.push(projectGroup);
  }

  removeProject(index: number) {
    this.projectForms.removeAt(index);
  }

  // Helper Methods
  loadUserData() {
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

    this.educationForms.clear();
    this.user.education?.forEach(edu => {
      this.educationForms.push(this.fb.group(edu));
    });

    this.experienceForms.clear();
    this.user.experience?.forEach(exp => {
      this.experienceForms.push(this.fb.group(exp));
    });

    this.skillForms.clear();
    this.user.skills?.forEach(skill => {
      this.skillForms.push(this.fb.group(skill));
    });

    this.keySkillForms.clear();
    this.user.keySkills?.forEach(skill => {
      this.keySkillForms.push(this.fb.group(skill));
    });

    this.projectForms.clear();
    this.user.projects?.forEach(project => {
      this.projectForms.push(this.fb.group(project));
    });

    this.profileForm.get('socialLinks')?.patchValue(this.user.socialLinks);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      // Store original values when entering edit mode
      this.storeOriginalValues();
      this.profileForm.get('personal.State')?.enable();
      this.profileForm.get('personal.District')?.enable();
    } else {
      // Reset to original values when canceling
      this.profileForm.get('personal.State')?.disable();
      this.profileForm.get('personal.District')?.disable();
      this.loadUserData();
    }
  }

  onSubmit() {
    if (!this.isCurrentTabValid()) {
      this.markCurrentTabAsTouched();
      this.toastr.error('Please fix the validation errors before submitting.', 'Error');
      return;
    }

    this.isLoading = true;
    const formValue = this.profileForm.value;
    
    this.user = {
      ...this.user,
      ...formValue.personal,
      education: formValue.education,
      experience: formValue.experience,
      skills: formValue.skills,
      keySkills: formValue.keySkills,
      projects: formValue.projects,
      socialLinks: formValue.socialLinks
    };

    switch (this.selectedTab) {
      case 'personal':
        this.savePersonalInfo();
        break;
      case 'experience':
        this.saveExperience();
        break;
      case 'education':
        this.saveEducation();
        break;
      case 'skills':
        this.saveSkills();
        break;
      case 'key-skills':
        this.saveKeySkills();
        break;
      case 'projects':
        this.saveProjects();
        break;
    }
  }

  savePersonalInfo() {
    this.empProfile = {
      empId: this.empId,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      bio: this.user.bio,
      phone: this.user.phone,
      location: this.user.location,
      state: Number(this.user.stateid),
      district: Number(this.user.districtId),
      currentPosition: this.user.currentPosition,
      currentSallary: this.user.currentSalary,
      expectedSallary: this.user.expectedSalary,
      resumeID: 0,
      empImageID: 0
    };

    this.employeeService.SaveEmployeesDetails(this.empProfile).subscribe({
      next: (data: any) => {
        if (data > 0) {
          this.toastr.success('Profile updated successfully!', 'Success');
          // Update original values after successful save
          this.storeOriginalValues();
        } else {
          this.toastr.error('Failed to update profile!', 'Error');
        }
        this.isLoading = false;
        this.isEditing = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to update profile!', 'Error');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  saveExperience() {
    const now = new Date().toISOString();
    const experiences = this.user.experience.map((exp: any) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate + '-01T' + now.split('T')[1]).toISOString() : null,
      endDate: exp.endDate ? new Date(exp.endDate + '-01T' + now.split('T')[1]).toISOString() : null
    }));

    this.employeeService.SaveExperience(experiences).subscribe({
      next: (data: any) => {
        if (data > 0) {
          this.toastr.success('Experience updated successfully!', 'Success');
          this.storeOriginalValues();
        } else {
          this.toastr.error('Failed to update experience!', 'Error');
        }
        this.isLoading = false;
        this.isEditing = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to update experience!', 'Error');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  saveEducation() {
    this.employeeService.SaveQuaification(this.user.education).subscribe({
      next: (data: any) => {
        if (data > 0) {
          this.toastr.success('Education updated successfully!', 'Success');
          this.storeOriginalValues();
        } else {
          this.toastr.error('Failed to update education!', 'Error');
        }
        this.isLoading = false;
        this.isEditing = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to update education!', 'Error');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  saveSkills() {
    this.employeeService.saveSkillDetails(this.user.skills).subscribe({
      next: (data: any) => {
        if (data > 0) {
          this.toastr.success('Skills updated successfully!', 'Success');
          this.storeOriginalValues();
        } else {
          this.toastr.error('Failed to update skills!', 'Error');
        }
        this.isLoading = false;
        this.isEditing = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to update skills!', 'Error');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  saveKeySkills() {
    this.employeeService.saveKeySkillDetails(this.user.keySkills).subscribe({
      next: (data: any) => {
        if (data > 0) {
          this.toastr.success('Key skills updated successfully!', 'Success');
          this.storeOriginalValues();
        } else {
          this.toastr.error('Failed to update key skills!', 'Error');
        }
        this.isLoading = false;
        this.isEditing = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to update key skills!', 'Error');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  saveProjects() {
    this.employeeService.saveProjectlDetails(this.user.projects).subscribe({
      next: (data: any) => {
        if (data > 0) {
          this.toastr.success('Projects updated successfully!', 'Success');
          this.storeOriginalValues();
        } else {
          this.toastr.error('Failed to update projects!', 'Error');
        }
        this.isLoading = false;
        this.isEditing = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to update projects!', 'Error');
        this.isLoading = false;
        this.isEditing = false;
      }
    });
  }

  onResumeUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.toastr.error('Please upload a PDF file', 'Error');
      return;
    }

    const maxSizeMB = 500;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      this.toastr.error('File size exceeds 500MB limit', 'Error');
      return;
    }

    const fileName = file.name;
    const fileType = file.name.split('.').pop()?.toLowerCase() || 'pdf';

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = (reader.result as string).split(',')[1];

      const resumeUploadModel = {
        employeeID: this.empId,
        docName: 'Resume',
        fileName: fileName,
        fileType: fileType,
        fileContentBase64: base64String,
        mode: "R"
      };

      this.employeeService.SaveDocument(resumeUploadModel).subscribe({
        next: (data: any) => {
          if (data > 0) {
            this.isResumeUploaded = true;
            this.user.resume = reader.result as string;
            this.toastr.success('Resume uploaded successfully!', 'Success');
            this.GetUserDetailsById(this.empId);
          } else {
            this.toastr.error('Failed to upload resume!', 'Error');
          }
        },
        error: (err: any) => {
          this.toastr.error('Failed to upload resume!', 'Error');
        }
      });
    };
    reader.readAsDataURL(file);
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    let allowedType = '';
    let docName = '';
    let fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSizeMB = 500;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
      this.toastr.error('File size exceeds 500MB limit', 'Error');
      return;
    }

    allowedType = 'image/jpeg';
    docName = 'ProfileImage';
    
    if (file.type !== allowedType && fileExt !== 'jpg' && fileExt !== 'jpeg') {
      this.toastr.error('Please upload a JPEG image only', 'Error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = (reader.result as string).split(',')[1];

      const uploadModel = {
        employeeID: this.empId,
        docName: docName,
        fileName: file.name,
        fileType: fileExt,
        fileContentBase64: base64String,
        mode: "P"
      };

      this.employeeService.SaveDocument(uploadModel).subscribe({
        next: (data: any) => {
          if (data > 0) {
            this.user.avatar = e.target.result;
            this.toastr.success('Profile image uploaded successfully!', 'Success');
          } else {
            this.toastr.error('Failed to upload profile image!', 'Error');
          }
        },
        error: (err: any) => {
          this.toastr.error('Failed to upload profile image!', 'Error');
        }
      });
    };
    reader.readAsDataURL(file);
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
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  }

  getProficiencyPercentage(proficiency: string): number {
    switch (proficiency) {
      case 'Basic': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  }

  private markCurrentTabAsTouched() {
    switch (this.selectedTab) {
      case 'personal':
        const personalGroup = this.profileForm.get('personal') as FormGroup;
        Object.keys(personalGroup.controls).forEach(key => {
          const control = personalGroup.get(key);
          control?.markAsTouched();
        });
        break;
      
      case 'experience':
        this.experienceForms.controls.forEach(control => {
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(key => {
              control.get(key)?.markAsTouched();
            });
          }
        });
        break;
      
      case 'education':
        this.educationForms.controls.forEach(control => {
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(key => {
              control.get(key)?.markAsTouched();
            });
          }
        });
        break;
      
      case 'skills':
        this.skillForms.controls.forEach(control => {
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(key => {
              control.get(key)?.markAsTouched();
            });
          }
        });
        break;
      
      case 'key-skills':
        this.keySkillForms.controls.forEach(control => {
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(key => {
              control.get(key)?.markAsTouched();
            });
          }
        });
        break;
      
      case 'projects':
        this.projectForms.controls.forEach(control => {
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(key => {
              control.get(key)?.markAsTouched();
            });
          }
        });
        break;
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