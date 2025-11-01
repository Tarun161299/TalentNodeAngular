import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';


interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  isRemote: boolean;
  experience: string;
  postedDate: string;
  applicationDeadline: string;
  skills: string[];
  category: string;
  isUrgent: boolean;
  applications: number;
}

@Component({
  selector: 'user-joblist',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './user-joblist.html',
  styleUrl: './user-joblist.css'
})
export class UserJoblist implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = 'all';
  selectedType = 'all';
  selectedLocation = 'all';

  categories = ['all', 'Technology', 'Design', 'Marketing', 'Sales', 'Finance', 'HR'];
  jobTypes = ['all', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  locations = ['all', 'Remote', 'New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'];

  ngOnInit() {
    // Simulate API call
    setTimeout(() => {
      this.jobs = [
        {
          id: '1',
          title: 'Senior Frontend Developer (Angular)',
          company: 'TechCorp Inc.',
          companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=center',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$90,000 - $120,000',
          description: 'We are looking for a skilled Angular developer to join our growing team. You will be responsible for building reusable components and front-end libraries.',
          isRemote: true,
          experience: '3-5 years',
          postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'HTML5', 'CSS3'],
          category: 'Technology',
          isUrgent: true,
          applications: 24
        },
        {
          id: '2',
          title: 'Backend Developer (Node.js)',
          company: 'DataSystems LLC',
          companyLogo: 'https://images.unsplash.com/photo-1556655848-f3a79cc6d4a7?w=100&h=100&fit=crop&crop=center',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$85,000 - $110,000',
          description: 'Join our backend team to build scalable and efficient server-side applications. You will work with cutting-edge technologies.',
          isRemote: false,
          experience: '2-4 years',
          postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'AWS'],
          category: 'Technology',
          isUrgent: false,
          applications: 18
        },
        {
          id: '3',
          title: 'UX/UI Designer',
          company: 'CreativeMinds Studio',
          companyLogo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop&crop=center',
          location: 'Austin, TX',
          type: 'Full-time',
          salary: '$75,000 - $95,000',
          description: 'We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design.',
          isRemote: true,
          experience: '3-6 years',
          postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research'],
          category: 'Design',
          isUrgent: true,
          applications: 32
        },
        {
          id: '4',
          title: 'Data Scientist',
          company: 'AI Innovations',
          companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center',
          location: 'Boston, MA',
          type: 'Full-time',
          salary: '$100,000 - $130,000',
          description: 'Join our AI research team to develop cutting-edge machine learning models. You will work on challenging problems.',
          isRemote: false,
          experience: '4-7 years',
          postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL'],
          category: 'Technology',
          isUrgent: false,
          applications: 15
        },
        {
          id: '5',
          title: 'DevOps Engineer',
          company: 'CloudScale Technologies',
          companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=center',
          location: 'Seattle, WA',
          type: 'Contract',
          salary: '$95,000 - $125,000',
          description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure.',
          isRemote: true,
          experience: '3-5 years',
          postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
          category: 'Technology',
          isUrgent: false,
          applications: 21
        },
        {
          id: '6',
          title: 'Product Manager',
          company: 'InnovateLabs',
          companyLogo: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=100&h=100&fit=crop&crop=center',
          location: 'Chicago, IL',
          type: 'Full-time',
          salary: '$110,000 - $140,000',
          description: 'We are seeking an experienced Product Manager to lead our product development initiatives.',
          isRemote: false,
          experience: '5-8 years',
          postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Stakeholder Management'],
          category: 'Technology',
          isUrgent: true,
          applications: 28
        }
      ];
      this.filteredJobs = [...this.jobs];
      this.isLoading = false;
    }, 1500);
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.applyFilters();
  }

  onTypeChange(event: any) {
    this.selectedType = event.target.value;
    this.applyFilters();
  }

  onLocationChange(event: any) {
    this.selectedLocation = event.target.value;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchTerm || 
        job.title.toLowerCase().includes(this.searchTerm) ||
        job.company.toLowerCase().includes(this.searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(this.searchTerm));

      const matchesCategory = this.selectedCategory === 'all' || 
        job.category === this.selectedCategory;

      const matchesType = this.selectedType === 'all' || 
        job.type === this.selectedType;

      const matchesLocation = this.selectedLocation === 'all' || 
        (this.selectedLocation === 'Remote' && job.isRemote) ||
        job.location === this.selectedLocation;

      return matchesSearch && matchesCategory && matchesType && matchesLocation;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedType = 'all';
    this.selectedLocation = 'all';
    this.filteredJobs = [...this.jobs];
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  isNewJob(dateString: string): boolean {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }
}
