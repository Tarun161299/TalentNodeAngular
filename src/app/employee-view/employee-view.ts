import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EmployeeService } from '../../Common/services/employee-service';
import { LoaderService } from '../../Common/services/loader-service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

interface Education {
  degEmpId: number;
  degree: number;
  institution: string;
  year: number;
  percentage: number;
  qualificationName?: string;
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
  skillname?: string;
}

interface KeySkill {
  keySkillEmpId: number;
  keySkillId: number;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  keyName?: string;
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

interface EmployeeProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  currentSalary: number;
  location: string;
  currentPosition: string;
  currentCompany: string;
  expectedSalary: number;
  noticePeriod: number;
  avatar: string;
  resume: string;
  stateid: number;
  districtId: number;
  state?: string;
  district?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  keySkills: KeySkill[];
  projects: Project[];
}

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './employee-view.html',
  styleUrls: ['./employee-view.css']
})
export class EmployeeViewComponent implements OnInit {
  @Input() employeeId?: number;
  @Input() showTabs: boolean = true;
  @Input() showActions: boolean = true;
  
  employee: EmployeeProfile = this.getEmptyEmployee();
  showPdf = false;
  selectedTab = 'personal';
  isLoading = false;
  defaultAvatar: string = 'assets/images/default-avatar.png';
  
  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  proficiencyLevels = ['Basic', 'Intermediate', 'Advanced', 'Expert'];

  constructor(
    private employeeService: EmployeeService,
    private loader: LoaderService,
    private toastr: ToastrService,
          private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('empId'));
    if (this.employeeId) {
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadEmployeeData(employeeId: number) {
    this.isLoading = true;
    this.loader.show();
    
    this.employeeService.getEmployeedetailsById(employeeId).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.loader.hide();
        this.employee = {
          ...this.getEmptyEmployee(),
          ...data,
          avatar: data.avatar ? `data:image/jpeg;base64,${data.avatar}` : this.defaultAvatar
        };
        
        // Set default values if null
        this.employee.education = this.employee.education || [];
        this.employee.experience = this.employee.experience || [];
        this.employee.skills = this.employee.skills || [];
        this.employee.keySkills = this.employee.keySkills || [];
        this.employee.projects = this.employee.projects || [];
        
        this.toastr.success('Employee data loaded successfully', 'Success');
      },
      error: (err: any) => {
        this.isLoading = false;
        this.loader.hide();
        this.toastr.error('Failed to load employee data', 'Error');
        console.error('Error loading employee:', err);
      }
    });
  }

  private getEmptyEmployee(): EmployeeProfile {
    return {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      currentSalary: 0,
      location: '',
      currentPosition: '',
      currentCompany: '',
      expectedSalary: 0,
      noticePeriod: 0,
      avatar: this.defaultAvatar,
      resume: '',
      stateid: 0,
      districtId: 0,
      education: [],
      experience: [],
      skills: [],
      keySkills: [],
      projects: []
    };
  }

  // View Resume Modal
  viewResume() {
    if (this.employee.resume) {
      this.showPdf = true;
    } else {
      this.toastr.warning('No resume available', 'Info');
    }
  }

  closeModal() {
    this.showPdf = false;
  }

  // Tab Navigation
  selectTab(tab: string) {
    if (this.showTabs) {
      this.selectedTab = tab;
    }
  }

  // Experience Calculation
  getTotalExperience(): string {
    const experiences = this.employee.experience;
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

  // Format Date
  formatDate(dateString: string): string {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  // Skill Level Percentage
  getSkillLevelPercentage(level: string): number {
    switch (level?.toLowerCase()) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 0;
    }
  }

  getProficiencyPercentage(proficiency: string): number {
    switch (proficiency?.toLowerCase()) {
      case 'basic': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 0;
    }
  }

  // Get Full Name
  getFullName(): string {
    return `${this.employee.firstName} ${this.employee.lastName}`.trim();
  }

  // Check if data exists for a tab
  hasTabData(tab: string): boolean {
    switch (tab) {
      case 'personal':
        return true; // Always show personal info
      case 'experience':
        return this.employee.experience.length > 0;
      case 'education':
        return this.employee.education.length > 0;
      case 'skills':
        return this.employee.skills.length > 0;
      case 'key-skills':
        return this.employee.keySkills.length > 0;
      case 'projects':
        return this.employee.projects.length > 0;
      default:
        return false;
    }
  }

  // Get current company/position text
  getCurrentPositionText(): string {
    const hasPosition = this.employee.currentPosition && this.employee.currentPosition.trim() !== '';
    const hasCompany = this.employee.currentCompany && this.employee.currentCompany.trim() !== '';
    
    if (!hasPosition && !hasCompany) return 'Not specified';
    if (hasPosition && !hasCompany) return this.employee.currentPosition;
    if (!hasPosition && hasCompany) return this.employee.currentCompany;
    
    return `${this.employee.currentPosition} at ${this.employee.currentCompany}`;
  }
}