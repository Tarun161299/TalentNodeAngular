import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../Common/services/employee-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { JobServices } from '../../Common/services/job-services';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Common/services/loader-service';
interface Applicant {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  CurrentPosition: string;
  Avatar: string;
  Resume: string;
  Location: string;
  Experience: Experience[];
  Skills: string[];
  AppliedDate: Date;
  totalPages?:0;
  totalRecords?:0;
  Status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
}

interface Experience {
  company: string;
  position: string;
  duration: string;
}

interface ApiResponse {
  applicants: Applicant[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Component({
  selector: 'view-applicant',
  standalone: true,
  imports: [CommonModule, FormsModule,NgSelectModule],
  templateUrl: './view-applicant.html',
  styleUrl: './view-applicant.css'
})
export class ViewApplicant implements OnInit {
  statusForApplicant:any;
  applicants: Applicant[] = [];
  selectedApplicant: Applicant | null = null;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalCount: number = 0;
  pages: number[] = [];
  jobId:Number=0;
  // Loading states
  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private empService:EmployeeService,
    private jobServices:JobServices,
     private toastr: ToastrService,
     private loader:LoaderService
  ) {}

  loadapplicantsreal(){
    debugger
  this.jobId = Number(this.route.snapshot.paramMap.get('jobid'));
    var data={
  jobId: this.jobId,
  pageNumber:  this.currentPage,
  pageSize: this.itemsPerPage
};
debugger
    this.empService.ApplicantList(data).subscribe(data=>{
      this.loader.hide()
        this.applicants = data.map((app:any) => ({
      Id: app.id,
      FirstName: app.firstName,
      LastName: app.lastName,
      Email: app.email,
      Phone: app.phone,
      CurrentPosition: app.currentPosition,
      Avatar:'data:image/jpeg;base64,'+ app.avatar || 'assets/default-avatar.jpg',
      Resume: 'data:application/pdf;base64,'+app.resume,
      Location: app.location,
      Experience: app.experience?.map((exp:any) => ({
        company: exp.company,
        position: exp.position,
        duration: `${exp.startDate} - ${exp.endDate || 'Present'}`
      })) || [],
      Skills: app.skills?.map((s:any) => s.name) || [],
      AppliedDate: app.applyDate ? new Date(app.applyDate) : null,
      Status: app.applicantStatusID,
      totalPages: app.totalPages,
      totalRecords:app.totalRecords,
    }));

          this.totalCount = this.applicants.length>0?this.applicants[0].totalRecords??0:0 ;
        this.totalPages = this.applicants.length>0?this.applicants[0].totalPages??0:0 ;
        //this.currentPage = response.currentPage;
        this.setupPagination();
    })
  }
  ngOnInit() {
    this.loader.show();
  this.loadapplicantsreal();
  
  }

  applyjob(data:any){
  //ApplyForJobs

}
formatDateRange(range: string): string {
  if (!range) return '';

  // Split the range by '-'
  const parts = range.split('-').map(p => p.trim());
  
  // Expecting something like ["2025", "10", "2025", "10"]
  if (parts.length < 4) return range;

  const startYear = parts[0];
  const startMonth = parts[1];
  const endYear = parts[2];
  const endMonth = parts[3];

  // Convert month number to short month name
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const startMonthName = monthNames[parseInt(startMonth, 10) - 1] || startMonth;
  const endMonthName = monthNames[parseInt(endMonth, 10) - 1] || endMonth;

  return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
}

  loadApplicants() {
    this.isLoading = true;
    this.isError = false;

    // Replace with your actual API endpoint
    const apiUrl = 'https://your-api.com/applicants';
    
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('pageSize', this.itemsPerPage.toString());

    this.http.get<ApiResponse>(apiUrl, { params }).subscribe({
      next: (response) => {
        this.applicants = response.applicants;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.setupPagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applicants:', error);
        this.isError = true;
        this.isLoading = false;
        // Fallback to mock data if API fails
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    // Mock data with 15 records for pagination testing
    this.applicants = [
      {
        Id: '1', FirstName: 'John', LastName: 'Doe', Email: 'john.doe@email.com', Phone: '+1-555-0101',
        CurrentPosition: 'Senior Angular Developer', Avatar: 'assets/avatar1.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'New York, NY',
        Experience: [{ company: 'Tech Solutions', position: 'Senior Developer', duration: '2020-Present' }],
        Skills: ['Angular', 'TypeScript', 'RxJS'], AppliedDate: new Date('2024-01-15'), Status: 'pending'
      },
      {
        Id: '2', FirstName: 'Jane', LastName: 'Smith', Email: 'jane.smith@email.com', Phone: '+1-555-0102',
        CurrentPosition: 'Full Stack Developer', Avatar: 'assets/avatar2.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'San Francisco, CA',
        Experience: [{ company: 'Digital Innovations', position: 'Full Stack Dev', duration: '2019-Present' }],
        Skills: ['Angular', '.NET Core', 'SQL'], AppliedDate: new Date('2024-01-16'), Status: 'reviewed'
      },
      {
        Id: '3', FirstName: 'Mike', LastName: 'Johnson', Email: 'mike.johnson@email.com', Phone: '+1-555-0103',
        CurrentPosition: 'Frontend Developer', Avatar: 'assets/avatar3.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Chicago, IL',
        Experience: [{ company: 'WebTech Ltd', position: 'Frontend Dev', duration: '2021-Present' }],
        Skills: ['React', 'JavaScript', 'CSS'], AppliedDate: new Date('2024-01-17'), Status: 'shortlisted'
      },
      {
        Id: '4', FirstName: 'Sarah', LastName: 'Wilson', Email: 'sarah.wilson@email.com', Phone: '+1-555-0104',
        CurrentPosition: 'Backend Developer', Avatar: 'assets/avatar4.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Austin, TX',
        Experience: [{ company: 'ServerStack Inc', position: 'Backend Dev', duration: '2018-Present' }],
        Skills: ['Node.js', 'Python', 'MongoDB'], AppliedDate: new Date('2024-01-18'), Status: 'interview'
      },
      {
        Id: '5', FirstName: 'David', LastName: 'Brown', Email: 'david.brown@email.com', Phone: '+1-555-0105',
        CurrentPosition: 'DevOps Engineer', Avatar: 'assets/avatar5.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Seattle, WA',
        Experience: [{ company: 'Cloud Systems', position: 'DevOps Engineer', duration: '2020-Present' }],
        Skills: ['AWS', 'Docker', 'Kubernetes'], AppliedDate: new Date('2024-01-19'), Status: 'hired'
      },
      {
        Id: '6', FirstName: 'Emily', LastName: 'Davis', Email: 'emily.davis@email.com', Phone: '+1-555-0106',
        CurrentPosition: 'UI/UX Designer', Avatar: 'assets/avatar6.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Los Angeles, CA',
        Experience: [{ company: 'Creative Designs', position: 'UI/UX Designer', duration: '2020-Present' }],
        Skills: ['Figma', 'Sketch', 'Adobe XD'], AppliedDate: new Date('2024-01-20'), Status: 'rejected'
      },
      {
        Id: '7', FirstName: 'Robert', LastName: 'Miller', Email: 'robert.miller@email.com', Phone: '+1-555-0107',
        CurrentPosition: 'Project Manager', Avatar: 'assets/avatar7.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Boston, MA',
        Experience: [{ company: 'Tech Leaders', position: 'Project Manager', duration: '2016-Present' }],
        Skills: ['Agile', 'Scrum', 'JIRA'], AppliedDate: new Date('2024-01-21'), Status: 'pending'
      },
      {
        Id: '8', FirstName: 'Lisa', LastName: 'Garcia', Email: 'lisa.garcia@email.com', Phone: '+1-555-0108',
        CurrentPosition: 'Data Scientist', Avatar: 'assets/avatar8.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Denver, CO',
        Experience: [{ company: 'Data Insights', position: 'Data Scientist', duration: '2021-Present' }],
        Skills: ['Python', 'R', 'TensorFlow'], AppliedDate: new Date('2024-01-22'), Status: 'reviewed'
      },
      {
        Id: '9', FirstName: 'James', LastName: 'Martinez', Email: 'james.martinez@email.com', Phone: '+1-555-0109',
        CurrentPosition: 'Mobile Developer', Avatar: 'assets/avatar9.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Miami, FL',
        Experience: [{ company: 'App Masters', position: 'Mobile Developer', duration: '2022-Present' }],
        Skills: ['React Native', 'Flutter', 'iOS'], AppliedDate: new Date('2024-01-23'), Status: 'shortlisted'
      },
      {
        Id: '10', FirstName: 'Amanda', LastName: 'Lee', Email: 'amanda.lee@email.com', Phone: '+1-555-0110',
        CurrentPosition: 'QA Engineer', Avatar: 'assets/avatar10.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Portland, OR',
        Experience: [{ company: 'Quality Assurance Pro', position: 'QA Engineer', duration: '2021-Present' }],
        Skills: ['Selenium', 'Jest', 'Cypress'], AppliedDate: new Date('2024-01-24'), Status: 'interview'
      },
      {
        Id: '11', FirstName: 'Thomas', LastName: 'Anderson', Email: 'thomas.anderson@email.com', Phone: '+1-555-0111',
        CurrentPosition: 'System Architect', Avatar: 'assets/avatar11.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Atlanta, GA',
        Experience: [{ company: 'Enterprise Solutions', position: 'System Architect', duration: '2017-Present' }],
        Skills: ['Microservices', 'AWS', 'System Design'], AppliedDate: new Date('2024-01-25'), Status: 'pending'
      },
      {
        Id: '12', FirstName: 'Jennifer', LastName: 'Taylor', Email: 'jennifer.taylor@email.com', Phone: '+1-555-0112',
        CurrentPosition: 'Product Manager', Avatar: 'assets/avatar12.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Dallas, TX',
        Experience: [{ company: 'Product Innovations', position: 'Product Manager', duration: '2019-Present' }],
        Skills: ['Product Strategy', 'Market Research'], AppliedDate: new Date('2024-01-26'), Status: 'reviewed'
      },
      {
        Id: '13', FirstName: 'Kevin', LastName: 'Clark', Email: 'kevin.clark@email.com', Phone: '+1-555-0113',
        CurrentPosition: 'Security Engineer', Avatar: 'assets/avatar13.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Washington, DC',
        Experience: [{ company: 'Cyber Security Pro', position: 'Security Engineer', duration: '2020-Present' }],
        Skills: ['Network Security', 'Penetration Testing'], AppliedDate: new Date('2024-01-27'), Status: 'shortlisted'
      },
      {
        Id: '14', FirstName: 'Michelle', LastName: 'Rodriguez', Email: 'michelle.rodriguez@email.com', Phone: '+1-555-0114',
        CurrentPosition: 'Database Administrator', Avatar: 'assets/avatar14.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Phoenix, AZ',
        Experience: [{ company: 'Data Management Inc', position: 'DBA', duration: '2021-Present' }],
        Skills: ['SQL Server', 'MySQL', 'PostgreSQL'], AppliedDate: new Date('2024-01-28'), Status: 'interview'
      },
      {
        Id: '15', FirstName: 'Daniel', LastName: 'White', Email: 'daniel.white@email.com', Phone: '+1-555-0115',
        CurrentPosition: 'Cloud Engineer', Avatar: 'assets/avatar15.jpg',
        Resume: 'data:application/pdf;base64,JVBERi0xLjUKJcfs...', Location: 'Salt Lake City, UT',
        Experience: [{ company: 'Cloud Technologies', position: 'Cloud Engineer', duration: '2022-Present' }],
        Skills: ['Azure', 'Google Cloud', 'Terraform'], AppliedDate: new Date('2024-01-29'), Status: 'hired'
      }
    ];

    this.totalCount = this.applicants.length;
    this.setupPagination();
  }

  setupPagination() {
   // this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    debugger
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadapplicantsreal();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadapplicantsreal();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadapplicantsreal();
    }
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalCount);
    return `Showing ${start}-${end} of ${this.totalCount} applicants`;
  }

  onStatusChange(applicant: Applicant) {
    debugger
    // API call to update status
   this.statusForApplicant={
    candidateId: applicant.Id,
  jobId: Number(this.jobId),
  status: applicant.Status.toString(),
  appliedDate: new Date(),
  updatedDate: new Date(),
  createdBy: "Recruiter"
  };
  this.jobServices.UpdateApllicantJobStatus(this.statusForApplicant).subscribe({
            next: (data: any) => {
              if (data > 0) {
              this.loadapplicantsreal();
                this.toastr.success('Status changed successfully!', 'Success');
              }
              else {
                this.toastr.error('Some error Occured!');
              }
             
            }, error: (err: any) => {
              this.toastr.error('Some error Occured!');
            
            }
          })
  }

  viewResume(applicant: Applicant) {
    this.selectedApplicant = applicant;
  }

  closeResume() {
    this.selectedApplicant = null;
  }

  downloadResume(applicant: Applicant) {
    if (applicant.Resume) {
      const link = document.createElement('a');
      link.href = applicant.Resume;
      link.download = `${applicant.FirstName}_${applicant.LastName}_Resume.pdf`;
      link.click();
    }
  }

  getSafeUrl(base64String: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
  }
}