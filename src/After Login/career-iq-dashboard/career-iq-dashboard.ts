// TypeScript interfaces
interface SkillData {
    name: string;
    demand: 'high' | 'medium' | 'low';
    match: number;
    trend: 'up' | 'down' | 'stable';
}

interface JobMatch {
    company: string;
    role: string;
    matchScore: number;
    salaryRange: string;
    applicationTip: string;
}

interface CareerIQData {
    userSkills: SkillData[];
    jobMatches: JobMatch[];
    marketInsights: {
        title: string;
        value: string;
        change: string;
        trend: 'positive' | 'negative' | 'neutral';
    }[];
    skillGap: string[];
    predictedSalary: string;
    aiRecommendation: string;
    lastUpdated: Date;
}

// DOM Elements
const analyticsBtn = document.getElementById('analyticsBtn') as HTMLButtonElement;
const careerIQModal = document.getElementById('careerIQModal') as HTMLDivElement;
const closeModalBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;
const refreshInsightsBtn = document.getElementById('refreshInsightsBtn') as HTMLButtonElement;
const quickLearnBtn = document.getElementById('quickLearnBtn') as HTMLButtonElement;
const generateResumeBtn = document.getElementById('generateResumeBtn') as HTMLButtonElement;
const lastUpdatedText = document.getElementById('lastUpdatedText') as HTMLParagraphElement;

// Mock data for CareerIQ
const mockCareerIQData: CareerIQData = {
    userSkills: [
        { name: 'JavaScript', demand: 'high', match: 90, trend: 'up' },
        { name: 'React', demand: 'high', match: 85, trend: 'up' },
        { name: 'TypeScript', demand: 'high', match: 65, trend: 'up' },
        { name: 'Node.js', demand: 'medium', match: 80, trend: 'stable' },
        { name: 'AWS', demand: 'high', match: 40, trend: 'up' },
        { name: 'GraphQL', demand: 'medium', match: 55, trend: 'up' }
    ],
    jobMatches: [
        {
            company: 'Spotify',
            role: 'Senior Frontend Engineer',
            matchScore: 89,
            salaryRange: '$140,000 - $180,000',
            applicationTip: 'Apply within 2 hours for early advantage'
        },
        {
            company: 'Netflix',
            role: 'UI/UX Developer',
            matchScore: 78,
            salaryRange: '$150,000 - $200,000',
            applicationTip: 'Highlight your React performance optimization experience'
        },
        {
            company: 'Airbnb',
            role: 'Full Stack Developer',
            matchScore: 82,
            salaryRange: '$130,000 - $170,000',
            applicationTip: 'Mention your design system experience'
        }
    ],
    marketInsights: [
        {
            title: 'Market Value',
            value: '$125,000',
            change: '+$8,500',
            trend: 'positive'
        },
        {
            title: 'Top 15%',
            value: 'in your city',
            change: '+2 positions',
            trend: 'positive'
        },
        {
            title: 'Response Rate',
            value: '24%',
            change: '+3%',
            trend: 'positive'
        }
    ],
    skillGap: ['TypeScript', 'AWS', 'GraphQL', 'Docker', 'CI/CD'],
    predictedSalary: '$125,000',
    aiRecommendation: 'Based on your profile and market trends, I recommend focusing on AI-integrated frontend roles. Your skills match 85% of these positions with average salary of $145,000.',
    lastUpdated: new Date()
};

// Chart bar hover functionality
function initializeChartBars(): void {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function(this: HTMLElement) {
            this.style.transform = 'scaleY(1.15)';
        });
        
        bar.addEventListener('mouseleave', function(this: HTMLElement) {
            this.style.transform = 'scaleY(1)';
        });
    });
}

// Update time function
function updateCurrentTime(): void {
    const now = new Date();
    const dateElement = document.querySelector('.current-date');
    const timeElement = document.querySelector('.current-time');
    
    if (dateElement && timeElement) {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
        timeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// CareerIQ Modal Functions
function openCareerIQModal(): void {
    if (careerIQModal) {
        careerIQModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateLastUpdatedTime();
        
        // Animate panels on open
        setTimeout(() => {
            const panels = document.querySelectorAll('.career-iq-panel');
            panels.forEach((panel, index) => {
                (panel as HTMLElement).style.animation = `countUp 0.8s ease-out ${index * 0.1}s forwards`;
            });
        }, 100);
    }
}

function closeCareerIQModal(): void {
    if (careerIQModal) {
        careerIQModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function updateLastUpdatedTime(): void {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    if (lastUpdatedText) {
        lastUpdatedText.textContent = `Last updated: ${formattedDate} at ${formattedTime}`;
    }
}

function refreshInsights(): void {
    const refreshBtn = refreshInsightsBtn;
    if (!refreshBtn) return;
    
    const originalText = refreshBtn.innerHTML;
    
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update with new data
        updateLastUpdatedTime();
        
        // Show success message
        refreshBtn.innerHTML = '<i class="fas fa-check"></i> Insights Updated';
        refreshBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        refreshBtn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        refreshBtn.style.color = '#10b981';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            refreshBtn.style.background = '';
            refreshBtn.style.borderColor = '';
            refreshBtn.style.color = '';
        }, 2000);
    }, 1500);
}

function startQuickLearn(): void {
    alert('Opening TypeScript course...\n\nCourse Title: "Master TypeScript in 30 Days"\nDuration: 15 minutes\nTopics: Types, Interfaces, Generics\n\nRedirecting to learning platform...');
    
    // In a real app, you would redirect to the course
    // window.open('https://example.com/courses/typescript', '_blank');
}

function generateCustomResume(): void {
    const loadingTexts = [
        "Analyzing your profile...",
        "Scanning market trends...",
        "Optimizing keywords...",
        "Formatting resume...",
        "Almost done..."
    ];
    
    let currentStep = 0;
    
    // Show loading indicator
    const originalText = generateResumeBtn.innerHTML;
    generateResumeBtn.disabled = true;
    
    const interval = setInterval(() => {
        generateResumeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingTexts[currentStep]}`;
        currentStep++;
        
        if (currentStep >= loadingTexts.length) {
            clearInterval(interval);
            
            // Show success
            generateResumeBtn.innerHTML = '<i class="fas fa-check"></i> Resume Generated!';
            generateResumeBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            setTimeout(() => {
                alert('✅ Custom Resume Generated!\n\nYour AI-optimized resume has been created with:\n• Targeted keywords for AI frontend roles\n• Quantified achievements\n• Skills ranked by market demand\n• ATS-friendly format\n\nYour resume is now 85% optimized for target roles!');
                
                // Reset button
                generateResumeBtn.innerHTML = originalText;
                generateResumeBtn.disabled = false;
                generateResumeBtn.style.background = '';
            }, 500);
        }
    }, 800);
}

// Initialize application stats with real-time updates
function initializeApplicationStats(): void {
    const statValues = document.querySelectorAll('.stat-item .stat-value');
    
    // Simulate real-time updates
    setInterval(() => {
        statValues.forEach(stat => {
            const currentValue = stat.textContent || '';
            const match = currentValue.match(/(\d+)%/);
            
            if (match) {
                const currentPercent = parseInt(match[1]);
                const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                const newPercent = Math.max(5, Math.min(95, currentPercent + randomChange));
                const trend = randomChange > 0 ? '↑' : randomChange < 0 ? '↓' : '→';
                
                stat.textContent = `${newPercent}% ${trend}`;
                
                // Update chart bars if they exist
                const chartBars = document.querySelectorAll('.chart-bar');
                const barIndex = Array.from(statValues).indexOf(stat);
                if (chartBars[barIndex]) {
                    const newHeight = 40 + (newPercent * 0.6);
                    (chartBars[barIndex] as HTMLElement).style.height = `${newHeight}%`;
                    (chartBars[barIndex] as HTMLElement).setAttribute('data-percentage', `${newPercent}%`);
                }
            }
        });
    }, 10000); // Update every 10 seconds
}

// Apply button click handler with proper typing
function handleApplyButtonClick(this: HTMLButtonElement): void {
    const jobTitle = this.closest('.job-card-enhanced')?.querySelector('h3')?.textContent;
    const company = this.closest('.job-card-enhanced')?.querySelector('.company-badge')?.textContent;
    
    alert(`🎉 Application Started!\n\nPosition: ${jobTitle}\nCompany: ${company}\n\nYour application is being prepared with:\n• Auto-filled information\n• Customized cover letter\n• Resume optimization\n\nGood luck!`);
    
    // Visual feedback
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-check"></i> Applied!';
    this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    this.disabled = true;
    
    setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = '';
        this.disabled = false;
    }, 3000);
}

// Save button click handler with proper typing
function handleSaveButtonClick(this: HTMLButtonElement): void {
    const icon = this.querySelector('i');
    if (icon) {
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.background = '#667eea';
            this.style.color = 'white';
            this.style.borderColor = '#667eea';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.background = '';
            this.style.color = '';
            this.style.borderColor = '';
        }
    }
}

// Join interview button click handler
function handleJoinButtonClick(): void {
    alert('🎥 Joining Google Meet interview...\n\nMeeting Details:\n• Time: 11:00 AM Today\n• Duration: 45 minutes\n• Interviewers: 2 (Technical + HR)\n• Preparation: Review behavioral questions\n\nGood luck! 🍀');
}

// Learn button click handler
function handleLearnButtonClick(): void {
    alert('📚 Opening Learning Path...\n\nRecommended Courses:\n1. TypeScript Fundamentals (8 hours)\n2. AWS Certified Developer (40 hours)\n3. GraphQL with React (12 hours)\n\nYour personalized learning path has been created!');
}

// Boost Profile button click handler
function handleBoostProfileClick(): void {
    alert('🚀 Boosting Your Profile...\n\nOptimizations applied:\n• Added 3 new projects\n• Enhanced skill keywords\n• Improved summary section\n• Added metrics to experience\n\nYour profile strength increased to 85%!');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeChartBars();
    updateCurrentTime();
    initializeApplicationStats();
    
    // Update time every second
    setInterval(updateCurrentTime, 1000);
    
    // Analytics button
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', openCareerIQModal);
    }
    
    // Close modal buttons
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCareerIQModal);
    }
    
    if (careerIQModal) {
        careerIQModal.addEventListener('click', (e) => {
            if (e.target === careerIQModal) {
                closeCareerIQModal();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && careerIQModal && careerIQModal.style.display === 'flex') {
            closeCareerIQModal();
        }
    });
    
    // CareerIQ buttons
    if (refreshInsightsBtn) {
        refreshInsightsBtn.addEventListener('click', refreshInsights);
    }
    
    if (quickLearnBtn) {
        quickLearnBtn.addEventListener('click', startQuickLearn);
    }
    
    if (generateResumeBtn) {
        generateResumeBtn.addEventListener('click', generateCustomResume);
    }
    
    // Search Jobs button
    const searchJobsBtn = document.getElementById('searchJobsBtn');
    if (searchJobsBtn) {
        searchJobsBtn.addEventListener('click', () => {
            alert('🔍 Opening job search...\n\nYou will be redirected to advanced job search with filters:\n• Remote positions\n• Salary range: $100k+\n• Tech companies\n• Posted in last 7 days');
        });
    }
    
    // Apply buttons
    const applyButtons = document.querySelectorAll('.apply-btn-glow');
    applyButtons.forEach(button => {
        button.addEventListener('click', handleApplyButtonClick);
    });
    
    // Save buttons
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', handleSaveButtonClick);
    });
    
    // Join interview button
    const joinButtons = document.querySelectorAll('.join-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', handleJoinButtonClick);
    });
    
    // Learn button
    const learnBtn = document.querySelector('.learn-btn');
    if (learnBtn) {
        learnBtn.addEventListener('click', handleLearnButtonClick);
    }
    
    // Boost Profile button
    const boostProfileBtn = document.querySelector('.action-btn.pulse');
    if (boostProfileBtn) {
        boostProfileBtn.addEventListener('click', handleBoostProfileClick);
    }
});

// Animation for countUp
const style = document.createElement('style');
style.textContent = `
    @keyframes countUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);