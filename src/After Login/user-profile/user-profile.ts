import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../Common/services/employee-service';
import { Employee } from '../../Model/AddProfile';
import { MasterServices } from '../../Common/services/master-services';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Imageupload } from '../../Common/services/imageupload';
import { LoaderComponent } from '../../loader-component/loader-component';
import { LoaderService } from '../../Common/services/loader-service';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

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
  skillEmpId:number;
  name: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

// New interfaces for Key Skills and Projects
interface KeySkill {
  keySkillEmpId: number;
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Project {
  projectEmpId: number;
  name: string;
  //role: string;
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
  keySkills: KeySkill[];  // Added
  projects: Project[];    // Added
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PdfViewerModule, ImageCropperComponent,],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  showPdf = false;
  isResumeUploaded: boolean = false;
  skillemployee:any;
  selectedTab = 'personal';
  degree: any;
  empId: number = 0;
  disticts: any;
  showP:string='';
  states: any;
  empProfile: Employee | undefined;
  
  // Avatar upload properties
  @ViewChild('fileInput') fileInput: any;
  showAvatarModal = false;
  avatarPreview: string | null = null;
  isUploading = false;
  uploadError: string | null = null;
  imageChangedEvent: any = null;
  croppedImage: string = '';
  showCropper = false;
  rotation = 0;
  scale = 1;
  maintainAspectRatio = true;
  aspectRatio = 1;
  resizeToWidth = 200;
  uploadProgress = 0;

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
    keySkills: [],  // Added
    projects: [],   // Added
    languages: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  };

  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  proficiencyLevels = ['Basic', 'Intermediate', 'Advanced', 'Expert']; // Added for Key Skills

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private masterServices: MasterServices,
    private imageperofile:Imageupload,
    private loader:LoaderService
  ) {
    this.showP=this.imageperofile.base64String();
    this.profileForm = this.createForm();
  }

  closeModal() {
    this.showPdf = false;
  }

  ngOnInit() {
    this.loader.show()
    var token = localStorage.getItem('token');
    if (this.isEditing == false) {
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
    this.GetUserDetailsById(this.empId);
  }

  viewResume() {
    this.showPdf = true;
  }

  GetUserDetailsById(id: number) {
    this.employeeService.getEmployeedetailsById(id).subscribe({
      next: (data: any) => {
        debugger;
        this.loader.hide()
        this.user = data;
        this.user.avatar= (data.avatar==null||data.avatar==undefined||data.avatar=='')?`data:image/png;base64,${this.showP}`:`data:image/jpeg;base64,${data.avatar}`;
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
        this.setFormArray('keySkills', this.user.keySkills);  // Added
        this.setFormArray('projects', this.user.projects);    // Added
      }, error: (err: any) => {
        this.loader.hide()
      }
    })
  }
  // Add this method to your component class
canSaveImage(): boolean {
  // Return true if we have a cropped image AND the cropper is showing
  return !!this.croppedImage && this.showCropper && !this.isUploading;
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
    debugger
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
      }, error: (err: any) => {}
    })
  }

  getAllQual() {
    this.masterServices.GetAllQualification().subscribe({
      next: (data: any) => {
        this.degree = data;
      }, error: (err: any) => {}
    })
  }

  getAllSkills() {
    this.masterServices.GetAllSkill().subscribe({
      next: (data: any) => {
        this.skillemployee = data;
      }, error: (err: any) => {}
    })
  }

  getAllDistricts() {
    this.masterServices.GetAllDistrict().subscribe({
      next: (data: any) => {
        this.disticts = data;
      }, error: (err: any) => {}
    })
  }

  createForm(): FormGroup {
    return this.fb.group({
      personal: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
        location: ['', Validators.required],
        districtId: ['', Validators.required],
        stateid: ['', Validators.required],
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
      keySkills: this.fb.array([]),  // Added
      projects: this.fb.array([]),   // Added
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

  get keySkillForms() {  // Added
    return this.profileForm.get('keySkills') as FormArray;
  }

  get projectForms() {   // Added
    return this.profileForm.get('projects') as FormArray;
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
    debugger
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
    this.experienceForms.push(experienceGroup);
  }

  removeExperience(index: number) {
    this.experienceForms.removeAt(index);
  }

  // Skills Methods
  addSkill() {
    const skillGroup = this.fb.group({
      skillEmpId:[this.empId],
      name: ['', Validators.required],
      level: ['Intermediate', Validators.required]
    });
    this.skillForms.push(skillGroup);
  }

  removeSkill(index: number) {
    this.skillForms.removeAt(index);
  }

  // Key Skills Methods (Added)
  addKeySkill() {
    const keySkillGroup = this.fb.group({
      keySkillEmpId: [this.empId],
      name: ['', Validators.required],
      proficiency: ['Intermediate', Validators.required]
    });
    this.keySkillForms.push(keySkillGroup);
  }

  removeKeySkill(index: number) {
    this.keySkillForms.removeAt(index);
  }

  // Projects Methods (Added)
  addProject() {
    const projectGroup = this.fb.group({
      projectEmpId: [this.empId],
      name: ['', Validators.required],
      //role: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      ongoing: [false],
      description: ['', Validators.required],
      technologies: [''],
      url: ['']
    });
    this.projectForms.push(projectGroup);
  }

  removeProject(index: number) {
    this.projectForms.removeAt(index);
  }

  // Helper Methods
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
    this.user.education?.forEach(edu => {
      this.educationForms.push(this.fb.group(edu));
    });

    // Experience
    this.experienceForms.clear();
    this.user.experience?.forEach(exp => {
      this.experienceForms.push(this.fb.group(exp));
    });

    // Skills
    this.skillForms.clear();
    this.user.skills?.forEach(skill => {
      this.skillForms.push(this.fb.group(skill));
    });

    // Key Skills (Added)
    this.keySkillForms.clear();
    this.user.keySkills?.forEach(skill => {
      this.keySkillForms.push(this.fb.group(skill));
    });

    // Projects (Added)
    this.projectForms.clear();
    this.user.projects?.forEach(project => {
      this.projectForms.push(this.fb.group(project));
    });

    // Social Links
    this.profileForm.get('socialLinks')?.patchValue(this.user.socialLinks);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleEdit() {
    debugger
    this.isEditing = !this.isEditing;
    if (this.isEditing == false) {
      this.profileForm.get('personal.State')?.disable();
      this.profileForm.get('personal.District')?.disable();
    }
    else {
      this.profileForm.get('personal.State')?.enable();
      this.profileForm.get('personal.District')?.enable();
    }
    if (!this.isEditing) {
      this.loadUserData();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        var formValue = this.profileForm.value;
        this.user = {
          ...this.user,
          ...formValue.personal,
          education: formValue.education,
          experience: formValue.experience,
          skills: formValue.skills,
          keySkills: formValue.keySkills,  // Added
          projects: formValue.projects,    // Added
          socialLinks: formValue.socialLinks
        };

        if (this.selectedTab === 'personal') {
          debugger
          this.empProfile = {
            empId: this.empId,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            bio: this.user.bio,
            phone: this.user.phone,
            location: this.user.location,
            state: Number(this.user.stateid),
            district:Number(this.user.districtId) ,
            currentPosition: this.user.currentPosition,
            currentSallary: this.user.currentSalary,
            expectedSallary: this.user.expectedSalary,
            resumeID: 0,
            empImageID: 0
          }
          this.employeeService.SaveEmployeesDetails(this.empProfile).subscribe({
            next: (data: any) => {
              if (data > 0) {
                this.toastr.success('Profile updated successfully!', 'Success');
              }
              else {
                this.toastr.error('Some error Occured!');
              }
              this.isLoading = false;
              this.isEditing = false;
            }, error: (err: any) => {
              this.toastr.error('Some error Occured!');
              this.isLoading = false;
              this.isEditing = false;
            }
          })
        }

        if (this.selectedTab === 'experience') {
          debugger
          var now = new Date().toISOString();
          var experiences = this.user.experience.map((exp: any) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate + '-01T' + now.split('T')[1]).toISOString() : null,
            endDate: exp.endDate ? new Date(exp.endDate + '-01T' + now.split('T')[1]).toISOString() : null
          }));
          debugger
          this.employeeService.SaveExperience(experiences).subscribe({
            next: (data: any) => {
              if (data > 0) {
                this.toastr.success('Profile updated successfully!', 'Success');
                this.isLoading = false;
                this.isEditing = false;
              }
              else {
                this.toastr.error('Some error Occured!');
                this.isLoading = false;
                this.isEditing = false;
              }
            }, error: (err: any) => {
              this.toastr.error('Some error Occured!');
              this.isLoading = false;
              this.isEditing = false;
            }
          })
        }

        if (this.selectedTab === 'education') {
          debugger
          this.employeeService.SaveQuaification(this.user.education).subscribe({
            next: (data: any) => {
              if (data > 0) {
                this.toastr.success('Profile updated successfully!', 'Success');
              }
              else {
                this.toastr.error('Some error Occured!');
              }
              this.isLoading = false;
              this.isEditing = false;
            }, error: (err: any) => {
              debugger
              this.toastr.error('Some error Occured!');
              this.isLoading = false;
              this.isEditing = false;
            }
          })
        }

        if (this.selectedTab === 'skills') {
          debugger
          this.employeeService.saveSkillDetails(this.user.skills).subscribe({
            next: (data: any) => {
              if (data > 0) {
                this.toastr.success('Profile updated successfully!', 'Success');
              }
              else {
                this.toastr.error('Some error Occured!');
              }
              this.isLoading = false;
              this.isEditing = false;
            }, error: (err: any) => {
              this.toastr.error('Some error Occured!');
              this.isLoading = false;
              this.isEditing = false;
            }
          })
        }

        // Handle Key Skills tab (Added)
        if (this.selectedTab === 'key-skills') {
          debugger
          // Add your API call for key skills here
          // Example: this.employeeService.saveKeySkills(this.user.keySkills).subscribe(...)
          this.toastr.success('Key skills updated successfully!', 'Success');
          this.isLoading = false;
          this.isEditing = false;
        }

        // Handle Projects tab (Added)
        if (this.selectedTab === 'projects') {
          debugger
          // Add your API call for projects here
          // Example: this.employeeService.saveProjects(this.user.projects).subscribe(...)
          this.toastr.success('Projects updated successfully!', 'Success');
          this.isLoading = false;
          this.isEditing = false;
        }

      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fix the form errors before submitting.', 'Error');
    }
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

    this.user.resume = event.target.result;
    var fileName = file.name;
    var fileType = file.name.split('.').pop()?.toLowerCase() || 'pdf';

    const reader = new FileReader();
    reader.onload = (e:any) => {
      var base64String = (reader.result as string).split(',')[1];

      var resumeUploadModel = {
        employeeID: this.empId,
        docName: 'Resume',
        fileName: fileName,
        fileType: fileType,
        fileContentBase64: base64String,
        mode:"R"
      };
      this.employeeService.SaveDocument(resumeUploadModel).subscribe({
        next:(data:any)=>{
          if(data>0){
            this.isResumeUploaded = true;
            this.user.resume = reader.result as string;
            this.toastr.success('Resume uploaded successfully!', 'Success');
            this.GetUserDetailsById(this.empId);
          } else {
            this.toastr.error('some error occured!');
          }
        },
        error:(err:any)=>{
          this.toastr.error('some error occured!');
        }
      })
    };
    reader.readAsDataURL(file);
  }

  // ===========================================
  // Avatar Upload and Cropping Methods
  // ===========================================

  triggerAvatarUpload() {
    if (!this.isEditing) {
      this.toastr.info('Please enable edit mode to change avatar', 'Info');
      return;
    }
    this.fileInput.nativeElement.click();
  }

  onAvatarFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.toastr.error('Please upload a valid image file (JPG, PNG, GIF, WEBP)', 'Error');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.toastr.error('Image size must be less than 5MB', 'Error');
      return;
    }

    // Reset cropper state
    this.showCropper = false;
    this.croppedImage = '';
    this.rotation = 0;
    this.scale = 1;
    this.uploadProgress = 0;

    // Show the modal
    this.imageChangedEvent = event;
    this.showAvatarModal = true;
    this.uploadError = null;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Image cropped! Event data:', event);
    // Store the cropped image data
  if (event.blob) {
    // For newer versions that return blob
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.croppedImage = e.target.result;
      console.log('Cropped image set from blob');
      
      // Manually trigger change detection
      setTimeout(() => {
        console.log('Save button should now be enabled');
      }, 0);
    };
    reader.readAsDataURL(event.blob);
  } else if (event.base64) {
    // For versions that return base64 directly
    this.croppedImage = event.base64;
    console.log('Cropped image set from base64');
    
    // Manually trigger change detection
    setTimeout(() => {
      console.log('Save button should now be enabled');
    }, 0);
  } else {
    console.error('No image data in cropped event');
    this.croppedImage = '';
  }

  }
  showPreviewModal = false;
previewImageUrl: string = '';
showImagePreview() {
  if (!this.isEditing && this.user.avatar) {
    this.previewImageUrl = this.user.avatar;
    this.showPreviewModal = true;
  }
}

// Close preview method
closePreviewModal() {
  this.showPreviewModal = false;
  this.previewImageUrl = '';
}

  imageLoaded(image: LoadedImage) {
    this.showCropper = true;
  }

  cropperReady() {
    // Cropper ready
  }

  loadImageFailed() {
    this.uploadError = 'Failed to load image. Please try another image.';
    this.toastr.error('Failed to load image', 'Error');
  }

  rotateLeft() {
    this.rotation -= 90;
  }

  rotateRight() {
    this.rotation += 90;
  }

  flipHorizontal() {
    this.scale = -this.scale;
  }

  flipVertical() {
    this.scale = Math.abs(this.scale) * -1;
  }

  zoomIn() {
    this.scale += 0.1;
  }

  zoomOut() {
    this.scale -= 0.1;
  }

  resetCropper() {
    this.rotation = 0;
    this.scale = 1;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.avatarPreview = null;
    this.showCropper = false;
  }

  closeAvatarModal() {
    this.showAvatarModal = false;
    this.resetCropper();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  saveCroppedAvatar() {
    if (!this.croppedImage) {
      this.toastr.error('Please crop the image first', 'Error');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 200);

    // Convert base64 to blob
    const byteString = atob(this.croppedImage.split(',')[1]);
    const mimeString = this.croppedImage.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], 'avatar.jpg', { type: mimeString });

    // Upload the cropped image
    this.uploadAvatar(file, progressInterval);
  }

  uploadAvatar(file: File, progressInterval: any) {
    let allowedType = '';
    let docName = '';
    let fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSizeMB = 5; // Changed from 500MB to 5MB for avatar
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
      this.toastr.error('File size exceeds 5MB limit', 'Error');
      clearInterval(progressInterval);
      this.isUploading = false;
      return;
    }

    allowedType = 'image/jpeg';
    docName = 'ProfileImage';
    if (file.type !== allowedType && fileExt !== 'jpg' && fileExt !== 'jpeg' && fileExt !== 'png') {
      this.toastr.error('Please upload a JPEG or PNG image only', 'Error');
      clearInterval(progressInterval);
      this.isUploading = false;
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
          clearInterval(progressInterval);
          this.uploadProgress = 100;
          
          if (data > 0) {
            this.user.avatar = e.target.result as string;
            const successMsg = 'Profile image uploaded successfully!';
            this.toastr.success(successMsg, 'Success');
            
            // Refresh user data after a delay to show progress completion
            setTimeout(() => {
              this.isUploading = false;
              this.closeAvatarModal();
              this.GetUserDetailsById(this.empId); // Refresh user data
            }, 500);
          } else {
            this.toastr.error('Some error occurred!', 'Error');
            this.isUploading = false;
          }
        },
        error: (err: any) => {
          clearInterval(progressInterval);
          this.toastr.error('Some error occurred while uploading!', 'Error');
          this.isUploading = false;
        }
      });
    };
    reader.readAsDataURL(file);
  }

  removeAvatar() {
    if (confirm('Are you sure you want to remove your profile photo?')) {
      // Reset avatar to default
      this.user.avatar = `data:image/png;base64,${this.showP}`;
      this.toastr.success('Profile photo removed successfully!', 'Success');
      
      // Here you might want to call an API to remove the avatar from server
      // Example: this.employeeService.removeAvatar(this.empId).subscribe(...)
    }
  }

  // Keep the original onAvatarChange method as backup
  onAvatarChange(event: any) {
    debugger
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

    var reader = new FileReader();
    reader.onload = (e:any) => {
      var base64String = (reader.result as string).split(',')[1];

      var uploadModel = {
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
            var successMsg = 'Profile image uploaded successfully!';
            this.toastr.success(successMsg, 'Success');
          } else {
            this.toastr.error('Some error occurred!', 'Error');
          }
        },
        error: (err:any) => {
          this.toastr.error('Some error occurred while uploading!', 'Error');
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

  getProficiencyPercentage(proficiency: string): number {  // Added
    switch (proficiency) {
      case 'Basic': return 25;
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