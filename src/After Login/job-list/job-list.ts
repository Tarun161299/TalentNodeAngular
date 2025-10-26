
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Job {
  id: number;
  title: string;
  status: 'active' | 'draft' | 'closed';
  department: string;
  location: string;
  description: string;
  salary: string;
  experience: string;
  type: string;
  applicantCount: number;
  newApplicants: number;
  interviews: number;
  postedDate: string;
}

@Component({
  selector: 'job-list',
standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css'
})
export class JobList implements OnInit {
  // Signals for reactive state management
  private jobsData = signal<Job[]>([
    {
      id: 1,
      title: "Senior Frontend Developer",
      status: "active",
      department: "Engineering",
      location: "Remote",
      description: "We are looking for an experienced Frontend Developer to build modern, responsive web applications using Angular and TypeScript.",
      salary: "$90,000 - $120,000",
      experience: "5+ years",
      type: "Full-time",
      applicantCount: 34,
      newApplicants: 5,
      interviews: 8,
      postedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Product Manager",
      status: "active",
      department: "Product",
      location: "San Francisco, CA",
      description: "Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.",
      salary: "$120,000 - $150,000",
      experience: "4+ years",
      type: "Full-time",
      applicantCount: 28,
      newApplicants: 3,
      interviews: 12,
      postedDate: "2024-01-10"
    },
    {
      id: 3,
      title: "UX/UI Designer",
      status: "draft",
      department: "Design",
      location: "New York, NY",
      description: "Create beautiful and intuitive user interfaces for our enterprise applications.",
      salary: "$85,000 - $110,000",
      experience: "3+ years",
      type: "Full-time",
      applicantCount: 0,
      newApplicants: 0,
      interviews: 0,
      postedDate: "2024-01-18"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      status: "closed",
      department: "Engineering",
      location: "Austin, TX",
      description: "Manage cloud infrastructure and CI/CD pipelines for our microservices architecture.",
      salary: "$100,000 - $130,000",
      experience: "4+ years",
      type: "Full-time",
      applicantCount: 42,
      newApplicants: 0,
      interviews: 15,
      postedDate: "2023-12-05"
    },
    {
      id: 5,
      title: "Data Scientist",
      status: "active",
      department: "Data Science",
      location: "Remote",
      description: "Analyze complex datasets and build machine learning models to drive business insights.",
      salary: "$110,000 - $140,000",
      experience: "3+ years",
      type: "Full-time",
      applicantCount: 19,
      newApplicants: 7,
      interviews: 6,
      postedDate: "2024-01-12"
    }
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

  ngOnInit(): void {
    // Component initialization if needed
  }

  // Actions
  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  updateFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  viewApplicants(jobId: number): void {
    console.log('Viewing applicants for job:', jobId);
    // Implement navigation or modal opening
  }

  editJob(jobId: number): void {
    console.log('Editing job:', jobId);
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