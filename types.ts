
export enum JobStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  CLOSED = 'Closed',
}

export enum ApplicationStatus {
  NEW = 'New',
  SHORTLISTED = 'Shortlisted',
  REJECTED = 'Rejected',
  HIRED = 'Hired',
}

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  YES_NO = 'yes_no',
  FILE = 'file',
  DATE = 'date',
  TIME = 'time',
  RANGE = 'range',
  MULTI_SELECT = 'multi_select',
  RATING = 'rating',
  TOGGLE = 'toggle',
  SKILLS = 'skills',
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
  defaultValue?: string | number | boolean;
  validation?: {
    min?: number;
    max?: number;
    regex?: string;
  };
  stepId?: string;
}

export interface FormStep {
  id: string;
  title: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workType: 'Onsite' | 'Remote' | 'Hybrid';
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  openings: number;
  experienceRange: { min: number; max: number };
  salaryRange: { min: number; max: number; currency: string };
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: JobStatus;
  postedDate: string;
  isFeatured: boolean;
  showOnCareers: boolean;
  
  overview: string;
  responsibilities: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  additionalInfo?: string;

  formSteps: FormStep[];
  formSchema: FormField[];
}

// --- Hiring Pipeline Types ---

export type StageStatus = 'New' | 'Cleared' | 'Rejected' | 'Pending' | 'On Hold';

export interface StageHistoryEntry {
  stageId: string;
  stageName: string;
  status: StageStatus;
  updatedAt: string;
  updatedBy: string;
  note?: string;
  emailSent: boolean;
  whatsappSent: boolean;
  interviewScheduled?: boolean; // New field
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'note' | 'email' | 'whatsapp' | 'interview' | 'other';
  content: string;
  date: string;
  user: string;
  meta?: any; // Flexible payload for details
}

export interface Interview {
  id: string;
  date: string;
  time: string;
  mode: 'Online' | 'Offline' | 'Phone';
  meetingLink?: string;
  interviewerName: string;
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  appliedDate: string;
  
  // Deprecated in favor of currentStageId, but kept for backward compat if needed
  status: ApplicationStatus; 
  
  // New Hiring Pipeline Fields
  currentStageId: string;
  currentStageStatus: StageStatus;
  stageHistory: StageHistoryEntry[];
  
  // New Interview Field
  upcomingInterview?: Interview;

  answers: Record<string, any>;
  resumeUrl?: string;
  rating: number;
  tags: string[];
  notes: string;
  timeline: TimelineEvent[];
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  shortlisted: number;
  hired: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

export interface PipelineStageDef {
    id: string;
    name: string;
    description: string;
}
