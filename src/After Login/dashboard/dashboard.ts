import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../Common/services/employee-service';
import { Observable, interval, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoaderService } from '../../Common/services/loader-service';
import { ToastrService } from 'ngx-toastr';

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

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  currentPosition: string;
  currentCompany: string;
  expectedSalary: number;
  currentSalary: number;
  noticePeriod: number;
  avatar: string;
  resume: string;
  stateid: number;
  districtId: number;
  education: any[];
  experience: any[];
  skills: any[];
  keySkills: any[];
  projects: any[];
  languages?: string[];
  socialLinks?: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

interface CompletionDetail {
  section: string;
  field: string;
  completed: boolean;
  weight: number;
  currentScore: number;
  maxScore: number;
  required: boolean;
  icon?: string;
  count?: number;
  subDetails?: any;
}

interface CompletionScore {
  score: number;
  details: CompletionDetail[];
}

interface QuickStat {
  type: string;
  icon: string;
  value: number | string;
  label: string;
}

interface Activity {
  icon: string;
  color: string;
  text: string;
  time: string;
}

interface Interview {
  time: string;
  date: string;
  company: string;
  position: string;
  platform: string;
}

interface Skill {
  name: string;
  level: number;
}

interface CompletionStep {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  action: () => void;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  userName: string = '';
  profileCompleteness: number = 0;
  userProfile: UserProfile | null = null;
  empId: number = 0;
  profileCompletionDetails: CompletionDetail[] = [];
  showBreakdown: boolean = false;
  showP: string = '';
  defaultAvatar: string = 'assets/images/default-avatar.png';

  // New properties for enhanced dashboard
  showCompletionModal: boolean = false;
  isLoading: boolean = true;
  
  // Updated date and time properties
  currentDate: string = '';
  currentTime: Observable<string>;
  currentTimeString: string = '';
  
  user: any;
  profileForm: any;
  private subscriptions: Subscription[] = [];

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

  // Mock data for new features
  private mockActivities: Activity[] = [
    { icon: 'fas fa-paper-plane', color: '#667eea', text: 'Applied for Senior Frontend Developer at TechCorp', time: '2 hours ago' },
    { icon: 'fas fa-eye', color: '#4CAF50', text: 'Viewed Product Manager role at InnovateLabs', time: '5 hours ago' },
    { icon: 'fas fa-file-download', color: '#FF9800', text: 'Downloaded interview preparation guide', time: '1 day ago' },
    { icon: 'fas fa-user-check', color: '#9C27B0', text: 'Profile viewed by 5 recruiters', time: '2 days ago' },
    { icon: 'fas fa-star', color: '#FFD700', text: 'Received 4-star rating for your resume', time: '3 days ago' }
  ];

  private mockInterviews: Interview[] = [
    { time: '10:00 AM', date: 'Today', company: 'TechCorp Inc.', position: 'Senior Frontend Developer', platform: 'Zoom' },
    { time: '2:30 PM', date: 'Tomorrow', company: 'DesignStudio', position: 'UX/UI Designer', platform: 'Google Meet' },
    { time: '11:00 AM', date: 'Oct 15', company: 'InnovateLabs', position: 'Product Manager', platform: 'Microsoft Teams' }
  ];

  private mockSkills: Skill[] = [
    { name: 'React.js', level: 85 },
    { name: 'TypeScript', level: 78 },
    { name: 'AWS Cloud', level: 65 },
    { name: 'UI/UX Design', level: 72 },
    { name: 'Project Management', level: 60 }
  ];
  
  EmployeeName: string = "";

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private loader: LoaderService,
    private toastr: ToastrService
  ) {
    // Initialize current time observable with formatted time
    this.currentTime = interval(1000).pipe(
      startWith(0),
      map(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        return now.toLocaleTimeString('en-US', options);
      })
    );

    // Initialize current date
    this.updateCurrentDate();
  }

  ngOnInit(): void {
    var token = localStorage.getItem('token');
    this.empId = Number(this.getClaimsFromToken(token == null || token == undefined ? "" : token).EmpId);
    this.loadUserData();
    this.loadApplicationStats();
    this.getDashboardData(this.empId);

    // Subscribe to currentTime observable to update string value
    const timeSubscription = this.currentTime.subscribe(time => {
      this.currentTimeString = time;
    });
    this.subscriptions.push(timeSubscription);

    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  ngAfterViewInit(): void {
    // Initialize any visual effects
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateCurrentDate(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.currentDate = now.toLocaleDateString('en-US', options);
  }

  getDashboardData(id: number): void {
    this.employeeService.getEmployeedetailsById(id).subscribe({
      next: (data: any) => {
        this.EmployeeName = (data.firstName ?? '') + ' ' + (data.lastName ?? '');
        this.user = data;
        this.user.avatar = (data.avatar == null || data.avatar == undefined || data.avatar == '') ?
          `data:image/png;base64,${this.showP}` :
          `data:image/jpeg;base64,${data.avatar}`;
      },
      error: (err: any) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }

  // Helper methods for template
  getAvatarUrl(): string {
    return this.userProfile?.avatar || 'assets/images/default-avatar.png';
  }

  getUserFullName(): string {
    if (this.userProfile?.firstName && this.userProfile?.lastName) {
      return `${this.userProfile.firstName} ${this.userProfile.lastName}`;
    }
    return this.userName || 'User';
  }

  getFormattedDate(): string {
    return this.currentDate;
  }

  getFormattedTime(): string {
    return this.currentTimeString;
  }

  getAbsoluteTrend(trend: number): number {
    return Math.abs(trend);
  }

  getAbsoluteRandomTrend(): number {
    return Math.abs(this.getRandomTrend());
  }

  // NEW ENHANCED METHODS FOR VIBRANT DESIGN
  getProgressColor(): string {
    if (this.profileCompleteness >= 80) return '#4CAF50';
    if (this.profileCompleteness >= 60) return '#FF9800';
    if (this.profileCompleteness >= 40) return '#FF5722';
    return '#F44336';
  }

  getApplicationTrend(): number {
    // Mock trend calculation
    return 12; // 12% increase
  }

  getStatColor(type: string): string {
    const colors: { [key: string]: string } = {
      total: '#667eea',
      pending: '#FF9800',
      shortlisted: '#4CAF50',
      rejected: '#F44336',
      selected: '#9C27B0'
    };
    return colors[type] || '#667eea';
  }

  getMatchScore(): number {
    if (!this.userProfile) return 0;

    // Calculate match score based on profile completeness and skills
    const baseScore = this.profileCompleteness;
    const skillsScore = Math.min(100, this.userProfile.skills?.length * 5 || 0);
    const experienceScore = Math.min(100, this.userProfile.experience?.length * 10 || 0);

    return Math.round((baseScore + skillsScore + experienceScore) / 3);
  }

  getMatchScoreColor(): string {
    const score = this.getMatchScore();
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  }

  getJobMatch(job: Job): number {
    // Mock job match calculation
    const matches: { [key: number]: number } = {
      1: 92,
      2: 85,
      3: 78
    };
    return matches[job.id] || 75;
  }

  getJobMatchColor(job: Job): string {
    const match = this.getJobMatch(job);
    if (match >= 90) return '#4CAF50';
    if (match >= 75) return '#2196F3';
    return '#FF9800';
  }

  getApplicants(job: Job): number {
    // Mock applicant count
    const applicants: { [key: number]: number } = {
      1: 42,
      2: 28,
      3: 35
    };
    return applicants[job.id] || 25;
  }

  getJobSkills(job: Job): string[] {
    // Mock job skills
    const skills: { [key: number]: string[] } = {
      1: ['React', 'TypeScript', 'Next.js'],
      2: ['Figma', 'UI/UX', 'Prototyping'],
      3: ['Product', 'Strategy', 'Agile']
    };
    return skills[job.id] || ['Skill 1', 'Skill 2'];
  }

  getQuickStats(): QuickStat[] {
    return [
      { type: 'views', icon: 'fas fa-eye', value: '245', label: 'Profile Views' },
      { type: 'saves', icon: 'fas fa-bookmark', value: '18', label: 'Saved Jobs' },
      { type: 'interviews', icon: 'fas fa-calendar-check', value: '3', label: 'Upcoming Interviews' },
      { type: 'messages', icon: 'fas fa-envelope', value: '12', label: 'Unread Messages' }
    ];
  }

  getRecentActivity(): Activity[] {
    return this.mockActivities;
  }

  getUpcomingInterviews(): Interview[] {
    return this.mockInterviews;
  }

  getSkillsToImprove(): Skill[] {
    return this.mockSkills;
  }

  getCompletionSteps(): CompletionStep[] {
    return [
      {
        number: 1,
        title: 'Upload Resume',
        description: 'Add your latest resume for better job matches',
        completed: !!(this.userProfile?.resume),
        action: () => this.uploadResume()
      },
      {
        number: 2,
        title: 'Complete Work Experience',
        description: 'Add at least 2 work experiences',
        completed: (this.userProfile?.experience?.length || 0) >= 2,
        action: () => this.router.navigate(['/profile/experience'])
      },
      {
        number: 3,
        title: 'Add Skills',
        description: 'List your technical and soft skills',
        completed: (this.userProfile?.skills?.length || 0) >= 5,
        action: () => this.router.navigate(['/profile/skills'])
      },
      {
        number: 4,
        title: 'Education Details',
        description: 'Complete your education history',
        completed: (this.userProfile?.education?.length || 0) >= 1,
        action: () => this.router.navigate(['/profile/education'])
      },
      {
        number: 5,
        title: 'Profile Picture',
        description: 'Add a professional profile photo',
        completed: !!(this.userProfile?.avatar),
        action: () => this.router.navigate(['/profile/edit'])
      }
    ];
  }

  getRandomTrend(): number {
    return Math.floor(Math.random() * 20) - 10;
  }

  // NEW ACTION METHODS
  searchJobs(): void {
    this.router.navigate(['/jobs/search']);
  }

  uploadResume(): void {
    console.log('Upload resume');
    // Implement resume upload logic
  }

  viewAnalytics(): void {
    this.router.navigate(['/analytics']);
  }

  viewApplications(): void {
    this.router.navigate(['/applications']);
  }

  improveMatch(): void {
    this.showCompletionModal = true;
  }

  saveJob(job: Job): void {
    console.log('Saving job:', job.title);
    // Implement save job logic
  }

  joinInterview(interview: Interview): void {
    console.log('Joining interview:', interview);
    // Implement join interview logic
  }

  openLearningPath(): void {
    this.router.navigate(['/learning']);
  }

  completeStep(step: CompletionStep): void {
    step.action();
  }

  filterApplications(event: Event): void {
    const period = (event.target as HTMLSelectElement).value;
    console.log('Filtering applications by:', period);
    // Implement filtering logic
  }

  // EXISTING METHODS FROM YOUR ORIGINAL CODE (with safety checks)
  loadUserData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const claims = this.getClaimsFromToken(token);
      this.userName = claims.UserName || 'User';
      this.empId = claims.EmpId || 0;

      if (this.empId > 0) {
        this.fetchUserProfile(this.empId);
      }
    }
  }

  getClaimsFromToken(token: string): any {
    if (!token) return {};
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Invalid token', error);
      return {};
    }
  }

  fetchUserProfile(empId: number): void {
    this.employeeService.getEmployeedetailsById(empId).subscribe({
      next: (data: any) => {
        this.userProfile = data;
        this.calculateDetailedProfileCompleteness();
      },
      error: (err: any) => {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  calculateDetailedProfileCompleteness(): void {
    if (!this.userProfile) {
      this.profileCompleteness = 0;
      this.profileCompletionDetails = [];
      return;
    }

    const completionDetails: CompletionDetail[] = [];
    let totalScore = 0;

    // 1. BASIC INFORMATION SECTION (25 points)
    const basicInfoScore = this.calculateBasicInfoScore();
    totalScore += basicInfoScore.score;
    completionDetails.push(...basicInfoScore.details);

    // 2. CAREER INFORMATION SECTION (20 points)
    const careerScore = this.calculateCareerInfoScore();
    totalScore += careerScore.score;
    completionDetails.push(...careerScore.details);

    // 3. EXPERIENCE SECTION (25 points)
    const experienceScore = this.calculateExperienceScore();
    totalScore += experienceScore.score;
    completionDetails.push(...experienceScore.details);

    // 4. EDUCATION SECTION (15 points)
    const educationScore = this.calculateEducationScore();
    totalScore += educationScore.score;
    completionDetails.push(...educationScore.details);

    // 5. SKILLS & EXPERTISE SECTION (15 points)
    const skillsScore = this.calculateSkillsScore();
    totalScore += skillsScore.score;
    completionDetails.push(...skillsScore.details);

    // Calculate final percentage
    this.profileCompleteness = Math.min(Math.round(totalScore), 100);
    this.profileCompletionDetails = completionDetails;
  }

  calculateBasicInfoScore(): CompletionScore {
    const details: CompletionDetail[] = [];
    let score = 0;

    if (!this.userProfile) return { score, details };

    const basicFields = [
      { field: 'firstName', label: 'First Name', weight: 4, required: true },
      { field: 'lastName', label: 'Last Name', weight: 4, required: true },
      { field: 'email', label: 'Email Address', weight: 4, required: true },
      { field: 'phone', label: 'Phone Number', weight: 4, required: true },
      { field: 'location', label: 'Location/City', weight: 3, required: true },
      { field: 'stateid', label: 'State', weight: 2, required: false },
      { field: 'districtId', label: 'District', weight: 2, required: false },
      { field: 'bio', label: 'Professional Summary', weight: 2, required: false }
    ];

    basicFields.forEach(field => {
      const value = this.userProfile![field.field as keyof UserProfile];
      const isFilled = Boolean(value && value.toString().trim().length > 0);
      const fieldScore = isFilled ? field.weight : 0;

      score += fieldScore;

      details.push({
        section: 'Basic Information',
        field: field.label,
        completed: isFilled,
        weight: field.weight,
        currentScore: fieldScore,
        maxScore: field.weight,
        required: field.required
      });
    });

    return { score, details };
  }

  calculateCareerInfoScore(): CompletionScore {
    const details: CompletionDetail[] = [];
    let score = 0;

    if (!this.userProfile) return { score, details };

    // Current Position & Company
    const hasPosition = Boolean(this.userProfile!.currentPosition &&
      this.userProfile!.currentPosition.trim().length > 0);
    const hasCompany = Boolean(this.userProfile!.currentCompany &&
      this.userProfile!.currentCompany.trim().length > 0);

    // Position score
    const positionScore = hasPosition ? 4 : 0;
    score += positionScore;
    details.push({
      section: 'Career Information',
      field: 'Current Position',
      completed: hasPosition,
      weight: 4,
      currentScore: positionScore,
      maxScore: 4,
      required: false
    });

    // Company score
    const companyScore = hasCompany ? 3 : 0;
    score += companyScore;
    details.push({
      section: 'Career Information',
      field: 'Current Company',
      completed: hasCompany,
      weight: 3,
      currentScore: companyScore,
      maxScore: 3,
      required: false
    });

    // Salary Information
    const hasCurrentSalary = Boolean(this.userProfile!.currentSalary &&
      this.userProfile!.currentSalary > 0);
    const hasExpectedSalary = Boolean(this.userProfile!.expectedSalary &&
      this.userProfile!.expectedSalary > 0);

    const currentSalaryScore = hasCurrentSalary ? 2 : 0;
    score += currentSalaryScore;
    details.push({
      section: 'Career Information',
      field: 'Current Salary',
      completed: hasCurrentSalary,
      weight: 2,
      currentScore: currentSalaryScore,
      maxScore: 2,
      required: false
    });

    const expectedSalaryScore = hasExpectedSalary ? 2 : 0;
    score += expectedSalaryScore;
    details.push({
      section: 'Career Information',
      field: 'Expected Salary',
      completed: hasExpectedSalary,
      weight: 2,
      currentScore: expectedSalaryScore,
      maxScore: 2,
      required: false
    });

    // Notice Period
    const hasNoticePeriod = Boolean(this.userProfile!.noticePeriod &&
      this.userProfile!.noticePeriod > 0);
    const noticeScore = hasNoticePeriod ? 2 : 0;
    score += noticeScore;
    details.push({
      section: 'Career Information',
      field: 'Notice Period',
      completed: hasNoticePeriod,
      weight: 2,
      currentScore: noticeScore,
      maxScore: 2,
      required: false
    });

    // Resume
    const hasResume = Boolean(this.userProfile!.resume &&
      this.userProfile!.resume.trim().length > 0);
    const resumeScore = hasResume ? 5 : 0;
    score += resumeScore;
    details.push({
      section: 'Career Information',
      field: 'Resume Uploaded',
      completed: hasResume,
      weight: 5,
      currentScore: resumeScore,
      maxScore: 5,
      required: true,
      icon: 'fas fa-file-pdf'
    });

    // Profile Picture
    const hasAvatar = Boolean(this.userProfile!.avatar &&
      this.userProfile!.avatar.trim().length > 0);
    const avatarScore = hasAvatar ? 2 : 0;
    score += avatarScore;
    details.push({
      section: 'Career Information',
      field: 'Profile Picture',
      completed: hasAvatar,
      weight: 2,
      currentScore: avatarScore,
      maxScore: 2,
      required: false,
      icon: 'fas fa-user-circle'
    });

    return { score, details };
  }

  calculateExperienceScore(): CompletionScore {
    const details: CompletionDetail[] = [];
    let score = 0;

    if (!this.userProfile) return { score, details };

    const experiences = this.userProfile!.experience || [];
    const hasExperience = experiences.length > 0;

    // Base score for having experience
    const baseScore = hasExperience ? 10 : 0;
    score += baseScore;

    details.push({
      section: 'Work Experience',
      field: 'Experience Added',
      completed: hasExperience,
      weight: 10,
      currentScore: baseScore,
      maxScore: 10,
      required: true,
      count: experiences.length
    });

    if (hasExperience) {
      // Calculate quality of experience entries
      let detailedExperienceCount = 0;
      let companyCount = 0;
      let positionCount = 0;
      let durationCount = 0;
      let descriptionCount = 0;

      experiences.forEach((exp: any) => {
        // Check completeness of each experience entry
        const hasCompany = Boolean(exp.company && exp.company.trim().length > 0);
        const hasPosition = Boolean(exp.position && exp.position.trim().length > 0);
        const hasStartDate = Boolean(exp.startDate && exp.startDate.trim().length > 0);
        const hasDescription = Boolean(exp.description && exp.description.trim().length > 0);
        const hasBothDates = Boolean(hasStartDate && (exp.endDate || exp.current));

        if (hasCompany && hasPosition && hasStartDate && hasDescription) {
          detailedExperienceCount++;
        }

        if (hasCompany) companyCount++;
        if (hasPosition) positionCount++;
        if (hasBothDates) durationCount++;
        if (hasDescription) descriptionCount++;
      });

      // Quality scoring
      const qualityScores = {
        companies: Math.min(companyCount, 3) * 1, // Max 3 points
        positions: Math.min(positionCount, 3) * 1, // Max 3 points
        durations: Math.min(durationCount, 3) * 1, // Max 3 points
        descriptions: Math.min(descriptionCount, 2) * 2, // Max 4 points
        detailedEntries: Math.min(detailedExperienceCount, 2) * 2.5 // Max 5 points
      };

      const qualityScore = Object.values(qualityScores).reduce((a: number, b: number) => a + b, 0);
      const qualityPoints = Math.min(qualityScore, 15);
      const hasQualityPoints = Boolean(qualityPoints > 5);

      score += qualityPoints;

      details.push({
        section: 'Work Experience',
        field: 'Experience Quality',
        completed: hasQualityPoints,
        weight: 15,
        currentScore: qualityPoints,
        maxScore: 15,
        required: false,
        subDetails: {
          detailedEntries: detailedExperienceCount,
          totalEntries: experiences.length
        }
      });
    }

    return { score, details };
  }

  calculateEducationScore(): CompletionScore {
    const details: CompletionDetail[] = [];
    let score = 0;

    if (!this.userProfile) return { score, details };

    const education = this.userProfile!.education || [];
    const hasEducation = education.length > 0;

    // Base score for having education
    const baseScore = hasEducation ? 5 : 0;
    score += baseScore;

    details.push({
      section: 'Education',
      field: 'Education Added',
      completed: hasEducation,
      weight: 5,
      currentScore: baseScore,
      maxScore: 5,
      required: true,
      count: education.length
    });

    if (hasEducation) {
      // Calculate quality of education entries
      let detailedEducationCount = 0;
      let hasPercentageValue = false;

      education.forEach((edu: any) => {
        // Check completeness of each education entry
        const hasDegree = Boolean(edu.degree && edu.degree.toString().trim().length > 0);
        const hasInstitution = Boolean(edu.institution && edu.institution.trim().length > 0);
        const hasYear = Boolean(edu.year && edu.year > 1900);
        const hasPercentage = Boolean(edu.percentage && edu.percentage > 0);

        if (hasDegree && hasInstitution && hasYear) {
          detailedEducationCount++;
        }

        // Score for percentage/CGPA
        if (hasPercentage) {
          hasPercentageValue = true;
        }
      });

      // Quality scoring
      const qualityScores = {
        detailedEntries: Math.min(detailedEducationCount, 2) * 3, // Max 6 points
        highestDegree: hasPercentageValue ? 2 : 0, // Max 2 points
        multipleEntries: education.length >= 2 ? 2 : 0 // Bonus for multiple entries
      };

      const qualityScore = Object.values(qualityScores).reduce((a: number, b: number) => a + b, 0);
      const qualityPoints = Math.min(qualityScore, 10);
      const hasQualityPoints = Boolean(qualityScore > 3);

      score += qualityPoints;

      details.push({
        section: 'Education',
        field: 'Education Quality',
        completed: hasQualityPoints,
        weight: 10,
        currentScore: qualityPoints,
        maxScore: 10,
        required: false,
        subDetails: {
          detailedEntries: detailedEducationCount,
          totalEntries: education.length
        }
      });
    }

    return { score, details };
  }

  calculateSkillsScore(): CompletionScore {
    const details: CompletionDetail[] = [];
    let score = 0;

    if (!this.userProfile) return { score, details };

    const skills = this.userProfile!.skills || [];
    const keySkills = this.userProfile!.keySkills || [];
    const hasSkills = skills.length > 0;
    const hasKeySkills = keySkills.length > 0;

    // Technical Skills
    const skillsScore = Math.min(skills.length, 5) * 1; // Max 5 points
    score += skillsScore;

    details.push({
      section: 'Skills & Expertise',
      field: 'Technical Skills',
      completed: hasSkills,
      weight: 5,
      currentScore: skillsScore,
      maxScore: 5,
      required: true,
      count: skills.length
    });

    // Key Skills
    const keySkillsScore = Math.min(keySkills.length, 3) * 1.67; // Max 5 points
    score += keySkillsScore;

    details.push({
      section: 'Skills & Expertise',
      field: 'Key Skills',
      completed: hasKeySkills,
      weight: 5,
      currentScore: keySkillsScore,
      maxScore: 5,
      required: false,
      count: keySkills.length
    });

    // Skills with proficiency levels
    let proficientSkillsCount = 0;
    skills.forEach((skill: any) => {
      if (skill.level && ['Advanced', 'Expert'].includes(skill.level)) {
        proficientSkillsCount++;
      }
    });

    const proficiencyScore = Math.min(proficientSkillsCount, 3) * 1.67; // Max 5 points
    const hasProficientSkills = proficientSkillsCount > 0;
    score += proficiencyScore;

    details.push({
      section: 'Skills & Expertise',
      field: 'Advanced Proficiency Skills',
      completed: hasProficientSkills,
      weight: 5,
      currentScore: proficiencyScore,
      maxScore: 5,
      required: false,
      count: proficientSkillsCount
    });

    return { score, details };
  }

  loadApplicationStats(): void {
    // Simply use the default stats - no API calls needed
    console.log('Using default application stats');
  }

  getTotalApplications(): number {
    return this.applicationStats.reduce((total, stat) => total + stat.count, 0);
  }

  completeProfile(): void {
    this.router.navigate(['/welcome/UserProfile']);
  }

  applyForJob(job: Job): void {
    console.log('Applying for job:', job.title);
  }

  quickApply(job: Job): void {
    console.log('Quick applying for job:', job.title);
  }

  viewJobAgain(job: Job): void {
    console.log('Viewing job again:', job.title);
  }

  toggleProfileBreakdown(): void {
    this.showBreakdown = !this.showBreakdown;
  }

  getCompletionTips(): string[] {
    const tips: string[] = [];

    if (!this.userProfile?.firstName || !this.userProfile?.lastName) {
      tips.push('Add your full name to complete basic information');
    }

    if (!this.userProfile?.email) {
      tips.push('Add your email address');
    }

    if (!this.userProfile?.phone) {
      tips.push('Add your phone number');
    }

    if (!this.userProfile?.resume) {
      tips.push('Upload your resume to increase chances by 40%');
    }

    if (!this.userProfile?.experience || this.userProfile.experience.length === 0) {
      tips.push('Add your work experience');
    }

    if (!this.userProfile?.skills || this.userProfile.skills.length === 0) {
      tips.push('Add your technical skills');
    }

    if (!this.userProfile?.education || this.userProfile.education.length === 0) {
      tips.push('Add your education details');
    }

    return tips.slice(0, 3);
  }

  getGroupedCompletionDetails(): any[] {
    const grouped: any = {};

    this.profileCompletionDetails.forEach(detail => {
      if (!grouped[detail.section]) {
        grouped[detail.section] = {
          name: detail.section,
          items: [],
          score: 0,
          maxScore: 0
        };
      }

      grouped[detail.section].items.push(detail);
      grouped[detail.section].score += detail.currentScore;
      grouped[detail.section].maxScore += detail.maxScore;
    });

    return Object.values(grouped);
  }

  simulateDynamicStats(): void {
    const intervalId = setInterval(() => {
      this.applicationStats = this.applicationStats.map(stat => {
        const randomChange = Math.floor(Math.random() * 3) - 1;
        return {
          ...stat,
          count: Math.max(0, stat.count + randomChange)
        };
      });
    }, 60000);

    this.subscriptions.push(new Subscription(() => clearInterval(intervalId)));
  }
}