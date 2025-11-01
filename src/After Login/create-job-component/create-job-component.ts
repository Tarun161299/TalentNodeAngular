import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MasterServices } from '../../Common/services/master-services';
import { JobServices } from '../../Common/services/job-services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job-component.html',
  styleUrls: ['./create-job-component.css']
})
export class CreateJobComponent {
  jobForm: FormGroup;
  isSubmitting = false;
  submitted = false;
  jobId!: number;

hrID:any;
CompanyData:any;
  // Predefined options
  jobTypes :any;
  experienceLevels = ['entry (0-1 years)', 'mid (2-3 years)', 'senior (3-5 years)', 'executive (5+ years)'];
  currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD','RUPEE'];
  categories = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR'];
  departments :any//= ['Technology', 'Product', 'HR', 'Finance', 'Marketing', 'Operations'];

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
  getAllBenefits(){
    this.MdServices.GetAllBenifits().subscribe({next:(data:any)=>{
      var transformedBenefits = data.map((benefit:any) => ({
  id: benefit.benefitId,
  name: benefit.benefitName
}));
this. benefitsOptions = [
  ...transformedBenefits
];
    },error:(err:any)=>{

    }})

  }
   getAllCompany(hrid:number){
    this.MdServices.GetAllCompany(hrid).subscribe({next:(data:any)=>{
   this.CompanyData=data;
    },error:(err:any)=>{

    }})

  }

   getAllDepartments(){
    this.MdServices.GetAllDepartment().subscribe({next:(data:any)=>{
   this.departments=data;
    },error:(err:any)=>{

    }})

  }
    GetAllJobType(){
    this.MdServices.GetAllJobType().subscribe({next:(data:any)=>{
   this.jobTypes=data;
    },error:(err:any)=>{

    }})

  }
  


  getAllSkills(){
    this.MdServices.GetAllSkill().subscribe({next:(data:any)=>{
  var transformedBenefits = data.map((benefit:any) => ({
  id: benefit.skillID,
  name: benefit.skillName
}));
this. skillsOptions = [
  ...transformedBenefits
];
    },error:(err:any)=>{

    }})

  }
 ngOnInit() {
  
    var token = localStorage.getItem('token');
   
    this.hrID = Number(this.getClaimsFromToken(token == null || token == undefined ? "" : token).HRId);
  this.getAllBenefits();
  this.getAllCompany(this.hrID);
  this. getAllDepartments();
  this.getAllSkills();
  this.GetAllJobType();
   this.jobId = Number(this.route.snapshot.paramMap.get('jobid'));
   if(this.jobId>0){
    this.jobServices.GetJobsdetail(this.jobId).subscribe((data:any)=>{
      
this.fillJobForm(data);
    })
   }

  }
  // Benefits options for multiselect
  benefitsOptions = [
    { id: 0, name: 'NA' },
    // { id: 'dental_insurance', name: 'Dental Insurance' },
    // { id: 'vision_insurance', name: 'Vision Insurance' },
    // { id: 'remote_work', name: 'Remote Work Options' },
    // { id: 'flexible_hours', name: 'Flexible Working Hours' },
    // { id: 'paid_time_off', name: 'Paid Time Off' },
    // { id: 'parental_leave', name: 'Parental Leave' },
    // { id: 'retirement_plan', name: 'Retirement Plan' },
    // { id: 'stock_options', name: 'Stock Options' },
    // { id: 'bonuses', name: 'Performance Bonuses' },
    // { id: 'training', name: 'Professional Development' },
    // { id: 'gym_membership', name: 'Gym Membership' },
    // { id: 'free_lunch', name: 'Free Lunch/Snacks' },
    // { id: 'commuter_benefits', name: 'Commuter Benefits' },
    // { id: 'equity', name: 'Equity' }
  ];

  // Skills options for multiselect
  skillsOptions = [
    { id: 0, name: 'NA' },
    // { id: 'typescript', name: 'TypeScript' },
    // { id: 'javascript', name: 'JavaScript' },
    // { id: 'react', name: 'React' },
    // { id: 'vue', name: 'Vue.js' },
    // { id: 'nodejs', name: 'Node.js' },
    // { id: 'python', name: 'Python' },
    // { id: 'java', name: 'Java' },
    // { id: 'csharp', name: 'C#' },
    // { id: 'php', name: 'PHP' },
    // { id: 'sql', name: 'SQL' },
    // { id: 'mongodb', name: 'MongoDB' },
    // { id: 'aws', name: 'AWS' },
    // { id: 'docker', name: 'Docker' },
    // { id: 'kubernetes', name: 'Kubernetes' },
    // { id: 'git', name: 'Git' },
    // { id: 'html', name: 'HTML' },
    // { id: 'css', name: 'CSS' },
    // { id: 'sass', name: 'SASS/SCSS' },
    // { id: 'rxjs', name: 'RxJS' },
    // { id: 'nestjs', name: 'NestJS' },
    // { id: 'express', name: 'Express.js' },
    // { id: 'postgresql', name: 'PostgreSQL' },
    // { id: 'mysql', name: 'MySQL' },
    // { id: 'redis', name: 'Redis' }
  ];

  constructor(private fb: FormBuilder,private MdServices:MasterServices,public jobServices: JobServices,   private toastr: ToastrService,private route: ActivatedRoute,private router:Router) {
    this.jobForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Basic Information
      title: ['', [Validators.required, Validators.minLength(5)]],
      company: ['', [Validators.required]],
      department: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['', [Validators.required]],
      vacancies: [1, [Validators.required, Validators.min(1)]],
      
      // Salary Information
      salaryMin: [null],
      salaryMax: [null],
      salaryCurrency: ['USD'],
      
      // Job Details
      description: ['', [Validators.required, Validators.minLength(20)]],
      experienceLevel: ['mid (2-3 years)', [Validators.required]],
      category: [''],
      
      // Benefits & Skills (multiselect)
      benefits: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      skills: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      
      // Application Details
      applicationLink: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      applicationDeadline: ['']
    }, { validators: this.salaryValidator });
  }
formatDateString(dateString: string): string {
  if (!dateString) return '';

  // Handle SQL-like date string: "2025-10-28 00:00:00.0000000"
  const parsedDate = new Date(dateString.replace(' ', 'T'));
  
  // Format as YYYY-MM-DD
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
  private salaryValidator(group: FormGroup) {
    const min = group.get('salaryMin')?.value;
    const max = group.get('salaryMax')?.value;
    
    if (min && max && min > max) {
      return { salaryRange: true };
    }
    
    return null;
  }

  // Getters for form arrays
  get benefitsArray() {
    return this.jobForm.get('benefits') as FormArray;
  }

  get skillsArray() {
    return this.jobForm.get('skills') as FormArray;
  }
private fillJobForm(job: any): void {
  
  this.jobForm.patchValue({
    title: job.title,
    company: job.company,
    department: job.department,
    location: job.location,
    type: job.type,
    vacancies: job.vacancies,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    description: job.description,
    experienceLevel: job.experienceLevel,
    category:( job.category==null)?"":job.category ,
    applicationLink:( job.applicationLink==null)?"":job.applicationLink,
    contactEmail: job.contactEmail,
    applicationDeadline: this.formatDateString(job.applicationDeadline)
  });

  // Clear previous selections
  this.benefitsArray.clear();
  this.skillsArray.clear();

  // ✅ Populate benefits
  if (job.benefits && job.benefits.length > 0) {
    job.benefits.forEach((benefitId: number) => {
      this.benefitsArray.push(this.fb.control(benefitId));
    });
  }

  // ✅ Populate skills
  if (job.skills && job.skills.length > 0) {
    job.skills.forEach((skillId: number) => {
      this.skillsArray.push(this.fb.control(skillId));
    });
  }
}

  // Benefits multiselect methods
  onBenefitChange(event: any, benefitId: number) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      this.benefitsArray.push(this.fb.control(benefitId));
    } else {
      const index = this.benefitsArray.controls.findIndex(
        control => control.value === benefitId
      );
      if (index >= 0) {
        this.benefitsArray.removeAt(index);
      }
    }
  }

  isBenefitSelected(benefitId: number): boolean {
    return this.benefitsArray.controls.some(
      control => control.value === benefitId
    );
  }

  getSelectedBenefits(): string[] {
    return this.benefitsArray.controls.map(control => control.value);
  }

  // Skills multiselect methods
  onSkillChange(event: any, skillId: number) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      this.skillsArray.push(this.fb.control(skillId));
    } else {
      const index = this.skillsArray.controls.findIndex(
        control => control.value === skillId
      );
      if (index >= 0) {
        this.skillsArray.removeAt(index);
      }
    }
  }

  isSkillSelected(skillId: number): boolean {
    return this.skillsArray.controls.some(
      control => control.value === skillId
    );
  }

  getSelectedSkills(): string[] {
    return this.skillsArray.controls.map(control => control.value);
  }

  getSelectedSkillNames(): string[] {
    return this.getSelectedSkills().map(skillId => {
      const skill = this.skillsOptions.find(s => s.id === Number(skillId));
      return skill ? skill.name : skillId;
    });
  }

  getSelectedBenefitNames(): string[] {
    return this.getSelectedBenefits().map((benefitId:any) => {
      if(this.benefitsOptions.length>0){ const benefit = this.benefitsOptions.find(b => b.id === Number(benefitId));
      return benefit ? benefit.name : benefitId;}
     
    });
  }

  // Form submission
  onSubmit() {
    this.submitted = true;

    if (this.jobForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        const formData = {
          jobId:this.jobId,
          ...this.jobForm.value,
          // benefits: this.getSelectedBenefitNames(),
          // skills: this.getSelectedSkillNames(),
          benefits:this.getSelectedBenefits(),
          skills:this.getSelectedSkills()
          // benefitIds: this.getSelectedBenefits(),
          // skillIds: this.getSelectedSkills()
        };
        debugger
this.jobServices.SaveJob(formData).subscribe({next:(data:any)=>{
  if(data>0){
    if(this.jobId>0){
      this.toastr.success("updated Successfully!!")
    }
    else{
this.toastr.success("Saved Successfully!!")
    }
       this.router.navigate(['/welcome/job-list']);
  
    
  }
  else{
    this.toastr.error("Some error occured !!")
  }
 console.log('Job created:', formData);
        this.isSubmitting = false;
        
        // Show success message
        this.jobForm.reset();
        this.resetFormArrays();
},error:(err:any)=>{
 console.log('error:', err);
        this.isSubmitting = false;
        
        // Show success message
        this.toastr.error("Some error occured !!")
        // this.jobForm.reset();
        // this.resetFormArrays();
}})
       
      }, 1500);
    }
  }

  onSaveDraft() {
    const formData = {
      ...this.jobForm.value,
      benefits: this.getSelectedBenefitNames(),
      skills: this.getSelectedSkillNames(),
          benefitIds: this.getSelectedBenefits(),
          skillIds: this.getSelectedSkills()
    };
    localStorage.setItem('jobDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.jobForm.reset();
      this.resetFormArrays();
    }
  }

  private resetFormArrays() {
    // Clear benefits array
    while (this.benefitsArray.length > 0) {
      this.benefitsArray.removeAt(0);
    }
    
    // Clear skills array
    while (this.skillsArray.length > 0) {
      this.skillsArray.removeAt(0);
    }
  }

  // Utility methods
  isFieldInvalid(fieldName: string): boolean {
    if(fieldName=='company'){
      
      const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getFieldError(fieldName: string): string {
    const field = this.jobForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return `Value must be at least ${field.errors['min'].min}`;
      if (field.errors['minlength'] && fieldName === 'benefits') return 'Select at least one benefit';
      if (field.errors['minlength'] && fieldName === 'skills') return 'Select at least one skill';
    }
    return '';
  }

  get descriptionLength(): number {
    return this.jobForm.get('description')?.value?.length || 0;
  }
}