import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule,PdfViewerModule],
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
  user: UserProfile
    = {
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
        },
        {
          employeeID: 0,
          experienceId: 0,
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ],
      skills: [
        
      ],
      languages: [],
      socialLinks: {
        linkedin: '',
        github: '',
        portfolio: ''
      }
    };

  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
closeModal() {
    this.showPdf = false;
  }
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
viewResume() {
  
    
        this.showPdf = true;
     
  
    
    // Implement PDF opening logic here
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

  GetUserDetailsById(id: number) {


    this.employeeService.getEmployeedetailsById(id).subscribe({
      next: (data: any) => {
        debugger;
        this.loader.hide()
        this.user = data;
        
        this.user.avatar= (data.avatar==null||data.avatar==undefined||data.avatar=='')?`data:image/png;base64,${this.showP}`:`data:image/jpeg;base64,${data.avatar}`;
        // ✅ Update resume upload status based on whether resume exists
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

        // patch social links
        this.profileForm.get('socialLinks')?.patchValue({
          linkedin: this.user.socialLinks?.linkedin ?? '',
          github: this.user.socialLinks?.github ?? '',
          portfolio: this.user.socialLinks?.portfolio ?? ''
        });

        // patch education, experience, skills if needed
        this.setFormArray('education', this.user.education);
        this.setFormArray('experience', this.user.experience);
        this.setFormArray('skills', this.user.skills);
      }, error: (err: any) => {
this.loader.hide()
      }
    })
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
      }, error: (err: any) => {

      }
    })
  }

  getAllQual() {
    this.masterServices.GetAllQualification().subscribe({
      next: (data: any) => {
        this.degree = data;
      }, error: (err: any) => {

      }
    })
  }
  getAllSkills() {
    this.masterServices.GetAllSkill().subscribe({
      next: (data: any) => {
        this.skillemployee = data;
      }, error: (err: any) => {

      }
    })
  }
  getAllDistricts() {
    this.masterServices.GetAllDistrict().subscribe({
      next: (data: any) => {
        this.disticts = data;
      }, error: (err: any) => {

      }
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

      // Simulate API call
      setTimeout(() => {
        var formValue = this.profileForm.value;
        this.user = {
          ...this.user,
          ...formValue.personal,
          education: formValue.education,
          experience: formValue.experience,
          skills: formValue.skills,
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
              this.isLoading = false;
              this.isEditing = false;
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

      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fix the form errors before submitting.', 'Error');
    }
  }

  // onAvatarChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     if (file.size > 5 * 1024 * 1024) {
  //       this.toastr.error('File size should be less than 5MB', 'Error');
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.user.avatar = e.target.result;
  //       this.toastr.success('Profile picture updated!', 'Success');
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

onResumeUpload(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  // ✅ Validate file type
  if (file.type !== 'application/pdf') {
    this.toastr.error('Please upload a PDF file', 'Error');
    return;
  }

  // ✅ Validate file size (max 500MB)
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
    this.employeeService.SaveDocument(resumeUploadModel).subscribe({next:(data:any)=>{
if(data>0){
  // ✅ Update local state immediately after successful upload
          this.isResumeUploaded = true;
          this.user.resume = reader.result as string;
this.toastr.success('Resume uploaded successfully!', 'Success');
// ✅ Optional: Force refresh user data from server to get the latest state
          this.GetUserDetailsById(this.empId);
}else{
this.toastr.error('some error occured!');
}
    },
  error:(err:any)=>{
this.toastr.error('some error occured!');
  }})
    
    console.log('Resume Upload Model:', resumeUploadModel);
    

    // 🔹 Optionally: Call API here
    // this.employeeService.uploadResume(resumeUploadModel).subscribe(...);
  };

  reader.readAsDataURL(file);
}
onAvatarChange(event: any) {
  debugger
  const file = event.target.files[0];
  if (!file) return;

  let allowedType = '';
  let docName = '';
  let fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  const maxSizeMB = 500;
  const fileSizeMB = file.size / (1024 * 1024);

  // ✅ Common validation for size
  if (fileSizeMB > maxSizeMB) {
    this.toastr.error('File size exceeds 500MB limit', 'Error');
    return;
  }

  // ✅ Type-specific validation

    allowedType = 'image/jpeg';
    docName = 'ProfileImage';
    if (file.type !== allowedType && fileExt !== 'jpg' && fileExt !== 'jpeg') {
      this.toastr.error('Please upload a JPEG image only', 'Error');
      return;
    }
  

  // ✅ Read the file and convert to Base64
  var reader = new FileReader();
  reader.onload = (e:any) => {
    var base64String = (reader.result as string).split(',')[1];

    var uploadModel = {
      employeeID: this.empId,
      docName: docName,
      fileName: file.name,
      fileType: fileExt,
      fileContentBase64: base64String,
      mode: "P"  // R = Resume, I = Image
    };

    console.log('Upload Model:', uploadModel);

    // ✅ API Call
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
