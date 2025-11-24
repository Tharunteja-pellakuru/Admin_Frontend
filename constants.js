import { JobStatus, ApplicationStatus } from "./types";

// NOTE: FieldType is assumed to be defined in "./types" for the MOCK_JOBS schema.
// Since 'FieldType' definition wasn't explicitly provided, it's assumed to exist
// in 'types.js' as an enum like: { URL: 'url', NUMBER: 'number', SKILLS: 'skills' }
const FieldType = {
  URL: "url",
  NUMBER: "number",
  SKILLS: "skills",
  // ... other types like text, email, file
};

// --- 1. Company Name ---

const COMPANY_NAME = "eParivatan Admin";

// --- 2. Hiring Stages Configuration (Full Pipeline) ---
// This list defines the granular steps of the recruitment process.

export const HIRING_STAGES = [
  {
    id: "Application Received",
    name: "Application Received",
    description: "Candidate has submitted application",
    order: 1,
    type: "start",
  },
  {
    id: "Resume Screening",
    name: "Resume Screening",
    description: "Reviewing CV and application details",
    order: 2, 
    type: "active",
  },
  {
    id: "Technical Test",
    name: "Technical Test",
    description: "Take-home assignment or coding test",
    order: 4,
    type: "active",
  },
  {
    id: "Technical Interview",
    name: "Technical Interview",
    description: "Live technical interview with team",
    order: 5,
    type: "active",
  },
  {
    id: "Managerial Interview",
    name: "Managerial Interview",
    description: "Interview with hiring manager",
    order: 6,
    type: "active",
  },
  {
    id: "HR Final Round",
    name: "HR Final Round",
    description: "Culture fit and salary discussion",
    order: 7,
    type: "active",
  },
  {
    id: "Offer Preparation",
    name: "Offer Preparation",
    description: "Creating the offer letter",
    order: 9,
    type: "active",
  },
  {
    id: "Offer Issued",
    name: "Offer Issued",
    description: "Offer sent to candidate",
    order: 10,
    type: "active",
  },
  {
    id: "Offer Accepted",
    name: "Offer Accepted",
    description: "Candidate accepted the offer",
    order: 11,
    type: "active",
  },
  {
    id: "Joined",
    name: "Joined",
    description: "Candidate has joined the company",
    order: 99, // Terminal success state
    type: "terminal_success",
  },
  {
    id: "Rejected", // Dedicated rejection stage
    name: "Rejected",
    description: "Application was formally rejected",
    order: 98, // Terminal failure state
    type: "terminal_failure",
  },
];

// --- 3. Notification Templates (Granular) ---
// These templates map to the full HIRING_STAGES list.

export const NOTIFICATION_TEMPLATES = {
  "Application Received": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Application Received`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Application Received**\n\nWe have received your application and are currently reviewing it.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Application Received' stage. We are reviewing it now!`,
  },
  "Resume Screening": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Resume Screening`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Resume Screening**\n\nWe are currently reviewing your profile in detail.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Resume Screening' stage. We are checking your profile.`,
  },

  "Technical Test": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Technical Test`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Technical Test**\n\nPlease check your email for the test link and instructions.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Technical Test' stage. Check email for test link.`,
  },
  "Technical Interview": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Technical Interview`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Technical Interview**\n\nYour test results were great! We are moving to the technical interview round.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Technical Interview' stage. Congrats!`,
  },
  "Managerial Interview": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Managerial Interview`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Managerial Interview**\n\nWe are excited to have you speak with our Hiring Manager.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Managerial Interview' stage. Good luck!`,
  },
  "HR Final Round": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — HR Final Round`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**HR Final Round**\n\nWe are in the final stages. Let's discuss culture fit and next steps.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'HR Final Round' stage. Almost there!`,
  },

  "Offer Preparation": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Offer Preparation`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Offer Preparation**\n\nWe are preparing your offer letter!\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Offer Preparation' stage. Offer coming soon!`,
  },
  "Offer Issued": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Offer Issued`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Offer Issued**\n\nCongratulations! Please check the attached offer letter.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Offer Issued' stage. Congrats! Check your email.`,
  },
  "Offer Accepted": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Offer Accepted`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Offer Accepted**\n\nWe are thrilled you accepted! We look forward to working with you.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Offer Accepted' stage. Welcome aboard!`,
  },

  "Joined": {
    emailSubject: `${COMPANY_NAME}: Update on Your Application — Joined`,
    emailBody: `Hi {candidateName},\n\nYour application for the position of {jobTitle} has progressed to:\n**Joined**\n\nWelcome to the team!\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, your application for {jobTitle} is now in the 'Joined' stage. Have a great first day!`,
  },
  "Rejected": {
    // Template for the new Terminal Rejection stage
    emailSubject: `Update on Your Application for {jobTitle}`,
    emailBody: `Dear {candidateName},\n\nThank you for your interest in the position of {jobTitle}. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe appreciate you taking the time to apply.\n\nBest Regards,\n${COMPANY_NAME} Hiring Team`,
    whatsapp: `Hi {candidateName}, update on your {jobTitle} application: We will not be moving forward at this time. Thank you for your interest.`,
  },
};

// --- 4. Interview Templates ---

export const INTERVIEW_TEMPLATES = {
  emailSubject: `Interview Scheduled — {jobTitle}`,
  emailBody: `Hi {candidateName},\n\nYour interview for the position of {jobTitle} is scheduled.\n\n• Date: {date}\n• Time: {time}\n• Mode: {mode}\n• Meeting Link: {meetingLink}\n• Interviewer: {interviewerName}\n\nPlease be available 10 minutes before the scheduled time.\n\nThanks,\n${COMPANY_NAME} HR Team`,
  whatsapp: `Your interview for {jobTitle} is scheduled on {date} at {time}. Mode: {mode}. Link: {meetingLink}. - ${COMPANY_NAME}`,
};

// --- 5. Mock Job Data ---

export const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior React Engineer",
    slug: "senior-react-engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    workType: "Hybrid",
    type: "Full-time",
    openings: 2,
    experienceRange: { min: 5, max: 8 },
    salaryRange: { min: 140000, max: 180000, currency: "USD" },
    category: "Software Development",
    priority: "High",
    status: JobStatus.PUBLISHED,
    postedDate: "2023-10-15",
    isFeatured: true,
    showOnCareers: true,
    overview:
      "We are looking for an experienced React developer to lead our frontend team.",
    responsibilities:
      "- Build scalable UI components\n- Mentor junior devs\n- Collaborate with design team",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
    niceToHaveSkills: ["Node.js", "GraphQL"],
    formSteps: [
      { id: "step1", title: "Personal Info" },
      { id: "step2", title: "Experience" },
    ],
    formSchema: [
      {
        id: "q1",
        type: FieldType.URL,
        label: "Portfolio URL",
        required: true,
        placeholder: "https://...",
        stepId: "step1",
      },
      {
        id: "q2",
        type: FieldType.NUMBER,
        label: "Years of React Experience",
        required: true,
        stepId: "step2",
      },
      {
        id: "q3",
        type: FieldType.SKILLS,
        label: "Top 3 Tech Skills",
        required: false,
        options: ["React", "Vue", "Angular", "Node", "Python"],
        stepId: "step2",
      },
    ],
  },
  {
    id: "2",
    title: "Product Designer",
    slug: "product-designer",
    department: "Design",
    location: "Remote",
    workType: "Remote",
    type: "Full-time",
    openings: 1,
    experienceRange: { min: 3, max: 5 },
    salaryRange: { min: 90000, max: 130000, currency: "USD" },
    category: "Design",
    priority: "Medium",
    status: JobStatus.PUBLISHED,
    postedDate: "2023-10-20",
    isFeatured: false,
    showOnCareers: true,
    overview: "Design beautiful interfaces for our core product.",
    responsibilities:
      "- Create wireframes and prototypes\n- Conduct user research",
    requiredSkills: ["Figma", "Prototyping", "UI/UX"],
    niceToHaveSkills: ["HTML/CSS", "Motion Design"],
    formSteps: [{ id: "step1", title: "Application" }],
    formSchema: [
      {
        id: "q_link",
        type: FieldType.URL,
        label: "Dribbble/Behance Link",
        required: true,
        stepId: "step1",
      },
    ],
  },
];

// --- 6. Mock Application Data ---

export const MOCK_APPLICATIONS = [
  // {
  //   id: "a1",
  //   jobId: "1",
  //   jobTitle: "Senior React Engineer",
  //   candidateName: "John Doe",
  //   email: "john@example.com",
  //   phone: "+1 (555) 010-9988",
  //   location: "San Jose, CA",
  //   linkedinUrl: "https://linkedin.com/in/johndoe",
  //   portfolioUrl: "https://johndoe.dev",
  //   appliedDate: "2023-10-26",
  //   status: ApplicationStatus.NEW, // High-level status
  //   currentStageId: "1_received", // Current granular stage
  //   currentStageStatus: "Pending", // Status within that stage
  //   stageHistory: [
  //     {
  //       stageId: "1_received",
  //       stageName: "Application Received",
  //       status: "Pending",
  //       updatedAt: "2023-10-26 10:00 AM",
  //       updatedBy: "System",
  //       emailSent: true,
  //       whatsappSent: false,
  //     },
  //   ],
  //   answers: {
  //     "Portfolio URL": "https://johndoe.dev",
  //     "Years of React Experience": 5,
  //     "Top 3 Tech Skills": ["React", "Node", "Python"],
  //   },
  //   resumeUrl: "#",
  //   rating: 0,
  //   tags: [],
  //   notes: "",
  //   timeline: [
  //     {
  //       id: "t1",
  //       type: "other",
  //       content: "Application received",
  //       date: "2023-10-26 10:00 AM",
  //       user: "System",
  //     },
  //   ],
  // },
  // {
  //   id: "a2",
  //   jobId: "1",
  //   jobTitle: "Senior React Engineer",
  //   candidateName: "Jane Smith",
  //   email: "jane@example.com",
  //   phone: "+1 (555) 123-4567",
  //   location: "Austin, TX",
  //   linkedinUrl: "https://linkedin.com/in/janesmith",
  //   appliedDate: "2023-10-27",
  //   status: ApplicationStatus.SHORTLISTED,
  //   currentStageId: "3_hr_screen",
  //   currentStageStatus: "Cleared",
  //   stageHistory: [
  //     {
  //       stageId: "1_received",
  //       stageName: "Application Received",
  //       status: "Cleared",
  //       updatedAt: "2023-10-27 09:30 AM",
  //       updatedBy: "System",
  //       emailSent: true,
  //       whatsappSent: false,
  //     },
  //     {
  //       stageId: "2_resume_screen",
  //       stageName: "Resume Screening",
  //       status: "Cleared",
  //       updatedAt: "2023-10-28 02:00 PM",
  //       updatedBy: "Admin User",
  //       emailSent: true,
  //       whatsappSent: true,
  //     },
  //     {
  //       stageId: "3_hr_screen",
  //       stageName: "HR Screening",
  //       status: "Cleared",
  //       updatedAt: "2023-10-30 11:00 AM",
  //       updatedBy: "Admin User",
  //       emailSent: true,
  //       whatsappSent: false,
  //     },
  //   ],
  //   answers: {
  //     "Portfolio URL": "https://jane.design",
  //     "Years of React Experience": 7,
  //   },
  //   resumeUrl: "#",
  //   rating: 4,
  //   tags: ["Strong Portfolio", "Senior"],
  //   notes: "Great communication skills during screening.",
  //   timeline: [
  //     {
  //       id: "t1",
  //       type: "other",
  //       content: "Application received",
  //       date: "2023-10-27 09:30 AM",
  //       user: "System",
  //     },
  //     {
  //       id: "t2",
  //       type: "status_change",
  //       content: "Advanced to HR Screening",
  //       date: "2023-10-28 02:00 PM",
  //       user: "Admin User",
  //     },
  //   ],
  // },
  // {
  //   id: "a3",
  //   jobId: "2",
  //   jobTitle: "Product Designer",
  //   candidateName: "Alice Wonderland",
  //   email: "alice@example.com",
  //   phone: "+44 20 7123 4567",
  //   location: "London, UK",
  //   appliedDate: "2023-10-28",
  //   status: ApplicationStatus.REJECTED,
  //   currentStageId: "2_resume_screen",
  //   currentStageStatus: "Rejected",
  //   stageHistory: [
  //     {
  //       stageId: "1_received",
  //       stageName: "Application Received",
  //       status: "Cleared",
  //       updatedAt: "2023-10-28 11:15 AM",
  //       updatedBy: "System",
  //       emailSent: true,
  //       whatsappSent: false,
  //     },
  //     {
  //       stageId: "2_resume_screen",
  //       stageName: "Resume Screening",
  //       status: "Rejected",
  //       updatedAt: "2023-10-29 10:00 AM",
  //       updatedBy: "Admin User",
  //       emailSent: true,
  //       whatsappSent: false,
  //     },
  //   ],
  //   answers: {
  //     "Dribbble/Behance Link": "https://dribbble.com/alice",
  //   },
  //   rating: 2,
  //   tags: [],
  //   notes: "Not enough experience with Figma.",
  //   timeline: [
  //     {
  //       id: "t1",
  //       type: "other",
  //       content: "Application received",
  //       date: "2023-10-28 11:15 AM",
  //       user: "System",
  //     },
  //     {
  //       id: "t2",
  //       type: "status_change",
  //       content: "Application Rejected at Resume Screening",
  //       date: "2023-10-29 10:00 AM",
  //       user: "Admin User",
  //     },
  //   ],
  // },
];
