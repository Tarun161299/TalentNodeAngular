import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Define interfaces locally
interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedDate: Date;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  resumeUrl?: string;
  coverLetter?: string;
  experience: number;
  skills: string[];
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  applicants: Applicant[];
}

// Define the status type explicitly
type ApplicantStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected';

@Component({
  selector: 'view-applicant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-applicant.html',
  styleUrl: './view-applicant.css'
})
export class ViewApplicant implements OnInit {
  jobPostings: JobPosting[] = [];
  selectedJob: JobPosting | null = null;
  selectedApplicant: Applicant | null = null;
  searchTerm = '';
  statusFilter = 'all';
  
  // Define status options with proper typing
  statusOptions: ApplicantStatus[] = ['pending', 'reviewed', 'shortlisted', 'rejected'];

  constructor() {}

  ngOnInit() {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Mock data
    this.jobPostings = [
      {
        id: '1',
        title: 'Senior Angular Developer',
        department: 'Engineering',
        location: 'Remote',
        applicants: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1-555-0101',
            appliedDate: new Date('2024-01-15'),
            status: 'reviewed',
            resumeUrl: '/resumes/john-doe.pdf',
            coverLetter: 'Experienced Angular developer with 5+ years of experience in building enterprise applications. Strong knowledge of RxJS, NgRx, and modern Angular practices.',
            experience: 5,
            skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'JavaScript']
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            phone: '+1-555-0102',
            appliedDate: new Date('2024-01-16'),
            status: 'pending',
            experience: 3,
            skills: ['Angular', 'JavaScript', 'HTML/CSS', 'Bootstrap']
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike.j@email.com',
            phone: '+1-555-0103',
            appliedDate: new Date('2024-01-14'),
            status: 'shortlisted',
            experience: 4,
            skills: ['React', 'Angular', 'Vue', 'TypeScript']
          }
        ]
      },
      {
        id: '2',
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'New York',
        applicants: [
          {
            id: '4',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@email.com',
            phone: '+1-555-0104',
            appliedDate: new Date('2024-01-18'),
            status: 'pending',
            experience: 6,
            skills: ['Angular', 'Node.js', 'MongoDB', 'Express']
          }
        ]
      },
      {
        id: '3',
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'San Francisco',
        applicants: [
          {
            id: '5',
            name: 'David Brown',
            email: 'david.brown@email.com',
            phone: '+1-555-0105',
            appliedDate: new Date('2024-01-20'),
            status: 'rejected',
            experience: 7,
            skills: ['Angular', 'React', 'Node.js', 'PostgreSQL']
          }
        ]
      }
    ];

    // Auto-select the first job by default
    if (this.jobPostings.length > 0) {
      this.selectedJob = this.jobPostings[0];
    }
  }

  selectJob(job: JobPosting): void {
    this.selectedJob = job;
    this.selectedApplicant = null;
  }

  selectApplicant(applicant: Applicant): void {
    this.selectedApplicant = applicant;
  }

  // Method 1: Accept string and validate
  updateStatus(applicantId: string, status: string): void {
    // Validate that the status is one of the allowed values
    const validStatus: ApplicantStatus[] = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    
    if (!validStatus.includes(status as ApplicantStatus)) {
      console.error('Invalid status:', status);
      return;
    }

    if (this.selectedJob) {
      // Update the status directly in the local data
      const applicant = this.selectedJob.applicants.find((a: Applicant) => a.id === applicantId);
      if (applicant) {
        applicant.status = status as ApplicantStatus;
      }
      if (this.selectedApplicant && this.selectedApplicant.id === applicantId) {
        this.selectedApplicant.status = status as ApplicantStatus;
      }
    }
  }

  // Alternative Method 2: Use strongly typed status
  updateStatusTyped(applicantId: string, status: ApplicantStatus): void {
    if (this.selectedJob) {
      const applicant = this.selectedJob.applicants.find((a: Applicant) => a.id === applicantId);
      if (applicant) {
        applicant.status = status;
      }
      if (this.selectedApplicant && this.selectedApplicant.id === applicantId) {
        this.selectedApplicant.status = status;
      }
    }
  }

  get filteredApplicants(): Applicant[] {
    if (!this.selectedJob) return [];

    return this.selectedJob.applicants.filter((applicant: Applicant) => {
      const matchesSearch = applicant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           applicant.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           applicant.skills.some((skill: string) => 
                             skill.toLowerCase().includes(this.searchTerm.toLowerCase())
                           );
      
      const matchesStatus = this.statusFilter === 'all' || applicant.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed';
      case 'shortlisted': return 'status-shortlisted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  downloadResume(applicant: Applicant): void {
    if (applicant.resumeUrl) {
      window.open(applicant.resumeUrl, '_blank');
    } else {
      alert('No resume available for this applicant');
    }
  }

  getApplicantCountByStatus(status: string): number {
    return this.selectedJob?.applicants.filter((applicant: Applicant) => applicant.status === status).length || 0;
  }

  getTotalApplicants(): number {
    return this.selectedJob?.applicants.length || 0;
  }
}