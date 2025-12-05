# AI Resume Classifier - Complete Pages Summary

## Overview
This document provides a comprehensive overview of all pages built for the AI Resume Classifier website.

## Navigation Structure

### Landing Page (`/`)
- Hero section with statistics
- Features showcase
- How it works explanation
- Team section (Krishna Pradhan, Nandan Panda, Suvendu Karan, Sameer Kumar Sahu)
- Contact form
- Login links for both recruiters and students

---

## Authentication Pages

### Recruiter Authentication
- **Recruiter Login** (`/recruiter-login`)
  - Email and password fields
  - Remember me option
  - Forgot password link
  - Sign up link

- **Recruiter Signup** (`/recruiter-signup`)
  - Full name, email, password fields
  - Company name
  - Terms acceptance
  - Login link

### Student Authentication
- **Student Login** (`/student-login`)
  - Email and password fields
  - Remember me option
  - Forgot password link
  - Sign up link

- **Student Signup** (`/student-signup`)
  - Full name, email, password fields
  - Field of study
  - Terms acceptance
  - Login link

### Shared Authentication
- **Forgot Password** (`/forgot-password`)
  - Email input for password reset
  - Back to login link

---

## Recruiter Portal Pages

### Dashboard (`/recruiter-dashboard`)
- Overview statistics:
  - Active Jobs
  - Total Applications
  - Candidates Reviewed
  - Shortlisted candidates
- Quick action cards:
  - Post New Job
  - Review Applications
  - Account Settings
- Recent job postings list
- User dropdown menu (Profile, Settings, Logout)

### Post Job (`/post-job`)
- Comprehensive job posting form:
  - Job Details (title, company, location, type, experience, salary)
  - Job Description
  - Requirements
  - Required Skills (with tag management)
- Save as Draft option
- Post Job button

### View Applications (`/view-applications`)
- Search and filter functionality
- Tabs for application status:
  - All
  - Pending
  - Reviewed
  - Shortlisted
  - Rejected
- Each application shows:
  - Candidate info with avatar
  - AI Match Score
  - Skills
  - Experience
  - Application date
- Actions:
  - View detailed resume
  - Download CV
  - Shortlist candidate
  - Reject candidate
- Detailed view modal for selected candidates

### Manage Jobs (`/manage-jobs`)
- Summary statistics
- Search functionality
- Tabs for job status:
  - All Jobs
  - Active
  - Drafts
  - Closed
- Each job listing shows:
  - Title, location, type
  - Salary range
  - Number of applicants
  - Posted date
  - Skills required
  - Status badge
- Actions per job:
  - View applicants (for active jobs)
  - Publish (for drafts)
  - View details
  - Edit job
  - Delete job
  - Close/Reopen job

### Recruiter Profile (`/recruiter-profile`)
- Profile header with avatar
- Contact information
- About/Bio section
- Recruiting specializations
- Edit mode with save/cancel
- Company information

### Recruiter Settings (`/recruiter-settings`)
- Password & Security
- Notification preferences:
  - Email notifications
  - New applications alerts
  - Messages
  - Weekly digest
- Privacy settings:
  - Profile visibility
  - Email/phone display
- Account deletion option

---

## Student Portal Pages

### Dashboard (`/student-dashboard`)
- Overview statistics:
  - Total Applications
  - Applications In Review
  - Scheduled Interviews
  - AI Match Score
- Search jobs section
- Quick action cards:
  - Upload Resume
  - Browse Jobs
  - My Profile
- Recent applications list
- Recommended jobs
- User dropdown menu (Profile, Settings, Logout)

### Browse Jobs (`/browse-jobs`)
- Search and filter functionality
- Job type filter (Full-time, Part-time, Contract, Internship)
- Two-column layout:
  - Left: Job cards list
  - Right: Selected job details (desktop only)
- Each job card shows:
  - Job title and company
  - AI Match Score
  - Location, type, experience level
  - Salary range
  - Required skills
  - Brief description
- Actions:
  - Apply Now
  - View Details
  - Save for Later

### Upload Resume (`/upload-resume`)
- Drag-and-drop file upload
- File browse option
- Supported formats: PDF, DOC, DOCX
- AI Analysis features:
  - Classification category
  - Confidence score
  - Identified skills
  - Experience level
  - Education
  - Strengths analysis
  - Improvement suggestions
  - Matched jobs with scores
- "What We Analyze" information section
- Reset/upload new resume option

### My Applications (`/my-applications`)
- Summary statistics by status
- Tabs for application status:
  - All
  - Pending
  - In Review
  - Interview
  - Accepted
  - Rejected
- Each application shows:
  - Job title and company
  - Location
  - Application date
  - Match score
  - Status badge with icon
  - Last update message
- Actions:
  - View job details
  - View interview details (if scheduled)
  - View offer (if accepted)
- Browse more jobs CTA

### Student Profile (`/student-profile`)
- Profile header with avatar
- Contact information
- About/Bio section
- Skills management (add/remove)
- Education information
- Edit mode with save/cancel

### Student Settings (`/student-settings`)
- Password & Security
- Notification preferences:
  - Email notifications
  - New job alerts
  - Application updates
  - Messages
  - Weekly digest
- Privacy settings:
  - Profile visibility to recruiters
  - Email/phone display
- Account deletion option

---

## Error Pages

### 404 Not Found (`/*` - invalid routes)
- Clear error message
- Return home button
- Friendly illustration

---

## Technical Features

### Routing
- Client-side routing with history API
- Smooth navigation between pages
- Back button support
- Scroll to top on navigation

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Collapsible navigation on mobile
- Adaptive layouts

### UI Components
- Reusable shadcn/ui components
- Consistent design system
- Accessible forms and inputs
- Interactive cards and badges
- Dropdown menus
- Tabs for content organization
- Progress bars
- Avatars with fallbacks

### Data Management
- Mock data for demonstration
- Ready for Flask backend integration
- Form validation
- State management with React hooks

### User Experience
- AI match scores prominently displayed
- Status badges with color coding
- Quick actions and CTAs
- Search and filter capabilities
- Drag-and-drop file upload
- Toast notifications (ready)
- Loading states

---

## Integration Points for Flask Backend

All pages are designed with clear integration points for your Flask backend:

1. **Authentication endpoints**
   - POST /api/auth/login (recruiter/student)
   - POST /api/auth/signup (recruiter/student)
   - POST /api/auth/forgot-password
   - POST /api/auth/logout

2. **Recruiter endpoints**
   - GET/POST /api/jobs
   - GET/PUT/DELETE /api/jobs/:id
   - GET /api/applications
   - PUT /api/applications/:id/status
   - GET/PUT /api/recruiter/profile
   - GET/PUT /api/recruiter/settings

3. **Student endpoints**
   - POST /api/resume/upload
   - POST /api/resume/analyze
   - GET /api/jobs/browse
   - GET /api/jobs/:id
   - POST /api/applications
   - GET /api/applications/my
   - GET/PUT /api/student/profile
   - GET/PUT /api/student/settings

4. **AI Processing**
   - Resume parsing and classification
   - Skill extraction
   - Job matching algorithm
   - Candidate scoring

---

## Team Members
- Krishna Pradhan
- Nandan Panda
- Suvendu Karan
- Sameer Kumar Sahu

---

## Next Steps

To integrate with your Flask backend:

1. Replace mock data with API calls
2. Implement authentication state management
3. Add proper error handling for API failures
4. Implement file upload to backend
5. Connect AI analysis to your ML models
6. Add real-time updates (optional)
7. Implement proper session management
8. Add email notifications (optional)

All components are ready to receive real data from your backend!
