import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


interface Job {
  id: number;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string;
  postedTime: string;
  timeAgo?: string;
  viewedTime?: string;
}

interface ApplicationStat {
  type: string;
  icon: string;
  count: number;
  label: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  userName: string = '';
  profileCompleteness: number = 80;

  applicationStats: ApplicationStat[] = [
    { type: 'total', icon: 'fas fa-file-alt', count: 24, label: 'Total Applications' },
    { type: 'pending', icon: 'fas fa-clock', count: 8, label: 'Pending' },
    { type: 'shortlisted', icon: 'fas fa-list', count: 6, label: 'Shortlisted' },
    { type: 'rejected', icon: 'fas fa-times', count: 5, label: 'Rejected' },
    { type: 'selected', icon: 'fas fa-check', count: 2, label: 'Selected' }
  ];

  recommendedJobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      companyName: 'TechCorp Inc.',
      companyLogo: '/assets/images/techcorp-logo.png',
      location: 'San Francisco, CA',
      salary: '$120,000 - $140,000',
      type: 'Full-time',
      postedTime: '2 hours ago'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      companyName: 'DesignStudio',
      companyLogo: '/assets/images/designstudio-logo.png',
      location: 'Remote',
      salary: '$90,000 - $110,000',
      type: 'Remote',
      postedTime: '5 hours ago'
    },
    {
      id: 3,
      title: 'Product Manager',
      companyName: 'InnovateLabs',
      companyLogo: '/assets/images/innovatelabs-logo.png',
      location: 'New York, NY',
      salary: '$130,000 - $150,000',
      type: 'Full-time',
      postedTime: '1 day ago'
    }
  ];

  latestJobs: Job[] = [
    {
      id: 4,
      title: 'Backend Engineer',
      companyName: 'DataSystems',
      location: 'Austin, TX',
      companyLogo: '',
      salary: '',
      type: '',
      postedTime: '',
      timeAgo: '30 min ago'
    },
    {
      id: 5,
      title: 'DevOps Specialist',
      companyName: 'CloudTech',
      location: 'Remote',
      companyLogo: '',
      salary: '',
      type: '',
      postedTime: '',
      timeAgo: '1 hour ago'
    },
    {
      id: 6,
      title: 'Mobile Developer',
      companyName: 'AppWorks',
      location: 'Boston, MA',
      companyLogo: '',
      salary: '',
      type: '',
      postedTime: '',
      timeAgo: '2 hours ago'
    }
  ];

  recentlyViewedJobs: Job[] = [
    {
      id: 7,
      title: 'Full Stack Developer',
      companyName: 'WebSolutions',
      location: 'Chicago, IL',
      companyLogo: '',
      salary: '',
      type: '',
      postedTime: '',
      viewedTime: 'Yesterday'
    },
    {
      id: 8,
      title: 'Data Scientist',
      companyName: 'AnalyticsPro',
      location: 'Seattle, WA',
      companyLogo: '',
      salary: '',
      type: '',
      postedTime: '',
      viewedTime: '2 days ago'
    }
  ];

  ngOnInit(): void {
    var token = localStorage.getItem('token');

this.userName= this.getClaimsFromToken(token==null || token==undefined ?"":token).UserName;
    // You can add initialization logic here
    // For example, fetching real data from APIs
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

  getTotalApplications(): number {
    return this.applicationStats.reduce((total, stat) => total + stat.count, 0);
  }
 constructor(private router: Router) {}
  completeProfile(): void {
    this.router.navigate(['/welcome/UserProfile']);
  }

  applyForJob(job: Job): void {
    // Implement apply job logic
    console.log('Applying for job:', job.title);
  }

  quickApply(job: Job): void {
    // Implement quick apply logic
    console.log('Quick applying for job:', job.title);
  }

  viewJobAgain(job: Job): void {
    // Implement view job again logic
    console.log('Viewing job again:', job.title);
  }

}