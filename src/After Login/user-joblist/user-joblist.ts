
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobServices } from '../../Common/services/job-services';
import { Route, Router, RouterModule } from '@angular/router';
import { ApplyForJob } from '../../Model/ApplyForJob';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Common/services/loader-service';


export interface Job {
  id: number;
  title: string;
  status: string;
  department: string;
  location: string;
  description: string;
  salary: string;
  experience: string;
  type: string;
  skills:string[];
  applicantCount: number;
  newApplicants: number;
  interviews: number;
  postedDate: string;
  employeeStatusForJob:string;
}


@Component({
  selector: 'user-joblist',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './user-joblist.html',
  styleUrl: './user-joblist.css'
})
export class UserJoblist implements OnInit {
  empId:number=0;
  jobstatus='';
  searchQueryfilter:string="";
  applyForJob:ApplyForJob | undefined;
   constructor(private jobServices:JobServices,private router:Router,private loader:LoaderService,   private toastr: ToastrService,){
 
   }
   // Signals for reactive statape management
   private jobsData = signal<Job[]>([
    
   ]);
 
   // Reactive signals
   searchQuery = signal<string>('');
   activeFilter = signal<string>('all');
   
   // Computed values
   filteredJobs = computed(() => {
     const jobs = this.jobsData();
     const query = this.searchQuery().toLowerCase();
     const filter = this.activeFilter();
     
     let filtered = jobs;
     
     // Apply status filter
     if (filter !== 'all') {
       filtered = filtered.filter(job => job.status === filter);
     }
     
     // Apply search filter
     if (query) {
       filtered = filtered.filter(job =>
         job.title.toLowerCase().includes(query) ||
         job.department.toLowerCase().includes(query) ||
         job.description.toLowerCase().includes(query)
       );
     }
     
     return filtered;
   });
 
   stats = computed(() => {
     const jobs = this.jobsData();
     return {
       total: jobs.length,
       active: jobs.filter(job => job.status === 'active').length,
       drafts: jobs.filter(job => job.status === 'draft').length,
       closed: jobs.filter(job => job.status === 'closed').length,
       totalApplicants: jobs.reduce((sum, job) => sum + job.applicantCount, 0),
       newApplicants: jobs.reduce((sum, job) => sum + job.newApplicants, 0)
     };
   });

   onSearchClick(){
var token = localStorage.getItem('token');
      this.loader.show()
     this.empId = Number(this.getClaimsFromToken(token == null || token == undefined ? "" : token).EmpId);
     this.getEmployeeList(this.empId);
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
   selectedJob: any = null;
 
 openDescription(job: any): void {
   this.selectedJob = job;
 }
 getStatusIconforemp(status: string): string {
  switch (status) {
    case '2':
      return 'fas fa-paper-plane';       // ✉️ Sent application
    case '3':
      return 'fas fa-user-check';         // ✅ Selected for interview
    case '4':
      return 'fas fa-comments';           // 💬 Interview discussion
    case '5':
      return 'fas fa-handshake';          // 🤝 Hired / Accepted
    case '6':
      return 'fas fa-user-times';         // ❌ Not selected
    default:
      return 'fas fa-info-circle';        // ℹ️ Default
  }
}

getStatusClass(status: string): string {
  switch (status) {
    case '2':
      return 'status-applied';
    case '3':
      return 'status-shortlisted';
    case '4':
      return 'status-interview';
    case '5':
      return 'status-hired';
    case '6':
      return 'status-rejected';
    default:
      return '';
  }
}
getName(status: string): string {
  switch (status) {
    case '2':
      return 'Applied';
    case '3':
      return 'Shortlisted';
    case '4':
      return 'Interview';
    case '5':
      return 'Hired';
    case '6':
      return 'Rejected';
    default:
      return '';
  }
}
applyjob(data:any){
  //ApplyForJobs
    this.loader.show()
  this.applyForJob={
    candidateId: this.empId,
  jobId: Number(data),
  status: "2",
  appliedDate: new Date(),
  updatedDate: new Date(),
  createdBy: "Employee"
  };
  this.jobServices.ApplyForJobs(this.applyForJob).subscribe({
            next: (data: any) => {
              this.loader.hide()
              if (data > 0) {
                 this.getEmployeeList(this.empId);
                this.toastr.success('Applied successfully!', 'Success');
              }
              else {
                this.toastr.error('Some error Occured!');
              }
             
            }, error: (err: any) => {
              this.toastr.error('Some error Occured!');
            this.loader.hide()
            }
          })
}

 closeModal(): void {
   this.selectedJob = null;
 }
   ngOnInit(): void {
     var token = localStorage.getItem('token');
      this.loader.show()
     this.empId = Number(this.getClaimsFromToken(token == null || token == undefined ? "" : token).EmpId);
     this.getEmployeeList(this.empId);

   }
   getEmployeeList(empid:any){
    var data={
      empId:empid,
      search:this.searchQueryfilter,
      status:this.jobstatus
    }
    this.jobServices.JobToEmployee(data).subscribe({next:(data:any)=>{
       this.stats = computed(() => {
     var jobs =data;
     return {
       total: jobs.length,
       active: jobs.filter((job:any) => job.status === 'active').length,
       drafts: jobs.filter((job:any) => job.status === 'draft').length,
       closed: jobs.filter((job:any) => job.status === 'closed').length,
       totalApplicants: jobs.reduce((sum:any, job:any) => sum + job.applicantCount, 0),
       newApplicants: jobs.reduce((sum:any, job:any) => sum + job.newApplicants, 0)
     };
   });
       this.loader.hide()
 this.jobsData=signal<Job[]>(data);
   this.filteredJobs = computed(() => {
     const jobs = this.jobsData();
     const query = this.searchQuery().toLowerCase();
     const filter = this.activeFilter();
     
     let filtered = jobs;
     
     // Apply status filter
     if (filter !== 'all') {
       filtered = filtered.filter(job => job.status === filter);
     }
     
     // Apply search filter
     if (query) {
       filtered = filtered.filter(job =>
         job.title.toLowerCase().includes(query) ||
         job.department.toLowerCase().includes(query) ||
         job.description.toLowerCase().includes(query)
       );
     }
     
     return filtered;
   })},error:(err:any)=>{
 this.loader.hide()
     }})
   }
 
   // Actions
   updateSearchQuery(query: string): void {
     this.searchQuery.set(query);
   }
 
   updateFilter(filter: string): void {
    this.jobstatus=filter;
     var token = localStorage.getItem('token');
      this.loader.show()
     this.empId = Number(this.getClaimsFromToken(token == null || token == undefined ? "" : token).EmpId);
     this.getEmployeeList(this.empId);
   }
 
   viewApplicants(jobId: number): void {
       this.router.navigate(['/welcome/view-applicant']);
     // Implement navigation or modal opening
   }
 
   editJob(jobId: number): void {
        this.router.navigate(['/welcome/CreateJob/'+jobId.toString()]);
     
     // Implement edit functionality
   }
 
   duplicateJob(jobId: number): void {
     console.log('Duplicating job:', jobId);
     // Implement duplicate functionality
   }
 
   deleteJob(jobId: number): void {
     if (confirm('Are you sure you want to delete this job posting?')) {
       this.jobsData.update(jobs => jobs.filter(job => job.id !== jobId));
     }
   }
 
   postNewJob(): void {
     console.log('Opening new job form');
        this.router.navigate(['/welcome/CreateJob/0']);
     // Implement new job creation
   }
 
   refreshJobs(): void {
     // Simulate API refresh
     console.log('Refreshing job data...');
   }
 
   formatDate(dateString: string): string {
     return new Date(dateString).toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric'
     });
   }
 
   getStatusColor(status: string): string {
     const colors = {
       active: '#10b981',
       draft: '#f59e0b',
       closed: '#ef4444'
     };
     return colors[status as keyof typeof colors] || '#6b7280';
   }
 
   getStatusIcon(status: string): string {
     const icons = {
       active: 'fa-circle-check',
       draft: 'fa-file-pen',
       closed: 'fa-circle-xmark'
     };
     return icons[status as keyof typeof icons] || 'fa-circle';
   }
}
