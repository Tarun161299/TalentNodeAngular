import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPage {
  
  constructor(private router: Router) {}

  @ViewChild('jobSearch') jobSearchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('locationSearch') locationSearchInput!: ElementRef<HTMLInputElement>;

onRoleSelection(role: string): void {
  if (role === 'Job Seeker') {  // Change this
    this.router.navigate(['login']);
    return;
  }
  if (role === 'Employer') {    // Change this
    this.router.navigate(['login']);
    return;
  }
}

  onSearch(): void {
    const jobTerm = this.jobSearchInput?.nativeElement?.value || '';
    const locationTerm = this.locationSearchInput?.nativeElement?.value || '';
    
    if (jobTerm || locationTerm) {
      alert(`Searching for: "${jobTerm}" in "${locationTerm}"`);
    } else {
      alert('Please enter search terms to find jobs.');
    }
  }

  onSaveJob(event: Event): void {
    const target = event.currentTarget as HTMLButtonElement;
    const icon = target.querySelector('i');
    if (icon && icon.classList.contains('far')) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      target.style.color = '#f59e0b';
    } else if (icon) {
      icon.classList.remove('fas');
      icon.classList.add('far');
      target.style.color = '#64748b';
    }
  }

  onApplyJob(jobTitle: string): void {
    alert(`Applying for: ${jobTitle}`);
  }

  onViewAllJobs(): void {
    alert('Viewing all jobs...');
  }

  onCreateProfile(): void {
    alert('Creating your profile...');
  }

  onPostJob(): void {
    alert('Posting a job...');
  }

  onNavigate(event: Event, section: string): void {
    event.preventDefault();
    alert(`Navigating to: ${section}`);
  }
}