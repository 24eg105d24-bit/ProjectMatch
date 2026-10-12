export const mockAdminStats = {
  totalStudents: 1428,
  activeProjects: 94,
  formedTeams: 78,
  averageMatchScore: '89.4%',
  pendingApprovalsCount: 5,
  growthRates: {
    students: '+14% this semester',
    projects: '+18% vs last year',
    teams: '+92% formation rate'
  }
};

export const mockDepartmentStats = [
  { name: 'Computer Science & Engineering', count: 480, percentage: 34, color: '#7c3aed' },
  { name: 'Design & Interaction Media', count: 295, percentage: 21, color: '#4f46e5' },
  { name: 'Data Science & Machine Learning', count: 245, percentage: 17, color: '#06b6d4' },
  { name: 'Electrical & Computer Engineering', count: 210, percentage: 15, color: '#10b981' },
  { name: 'Business & Information Systems', count: 198, percentage: 13, color: '#f59e0b' }
];

export const mockPendingProjects = [
  {
    id: 'sub-201',
    title: 'MediVision: Retinal Scan Analysis for Diabetic Retinopathy',
    creator: 'Farhan Zaidi',
    department: 'Biomedical & CS',
    submittedAt: 'Oct 09, 2026',
    requestedTeamSize: 4,
    status: 'Pending Review',
    riskLevel: 'Low (Complies with Lab Policy)'
  },
  {
    id: 'sub-202',
    title: 'SolSafe: Decentralized Microgrid Solar Trading Engine',
    creator: 'Maya Lin',
    department: 'Electrical Engineering',
    submittedAt: 'Oct 08, 2026',
    requestedTeamSize: 5,
    status: 'Pending Review',
    riskLevel: 'Low'
  },
  {
    id: 'sub-203',
    title: 'NeuroPlay: EEG-Controlled Accessible Game Controller',
    creator: 'Lucas Sterling',
    department: 'Cognitive Science & Robotics',
    submittedAt: 'Oct 07, 2026',
    requestedTeamSize: 4,
    status: 'Needs Revision',
    riskLevel: 'Requires Safety Mentor'
  },
  {
    id: 'sub-204',
    title: 'CampusPantry: Real-Time Food Bank Inventory Sync',
    creator: 'Chloe Bennett',
    department: 'Social Work & Informatics',
    submittedAt: 'Oct 06, 2026',
    requestedTeamSize: 3,
    status: 'Approved',
    riskLevel: 'Low'
  }
];

export const mockRecentActivities = [
  { id: 'act-1', event: 'New Team Formed: CampusPulse (4/4 members locked)', time: '14 minutes ago', type: 'team' },
  { id: 'act-2', event: 'Alex Chen requested to join CampusPulse as Frontend Architect', time: '1 hour ago', type: 'request' },
  { id: 'act-3', event: 'Prof. Vance approved faculty mentorship for StudySync', time: '3 hours ago', type: 'mentor' },
  { id: 'act-4', event: '24 new student profiles registered from CSE-499 Capstone cohort', time: '5 hours ago', type: 'student' },
  { id: 'act-5', event: 'Compatibility report generated for 86 unpartnered students', time: '8 hours ago', type: 'system' }
];
