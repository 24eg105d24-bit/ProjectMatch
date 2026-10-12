export const currentStudent = {
  id: 'std-101',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  headline: 'Junior Computer Science & Human-Computer Interaction Major',
  university: 'State Polytechnic Institute',
  department: 'Computer Science & Engineering',
  year: 'Junior (Year 3)',
  gpa: '3.82',
  bio: 'Passionate about building intuitive, high-performance web applications and design systems. Looking for motivated peers to build a standout capstone project with meaningful real-world utility.',
  availability: {
    hoursPerWeek: 15,
    preferredTime: 'Weekday evenings & Weekend afternoons',
    timezone: 'UTC-5 (EST)',
    status: 'Actively Looking',
  },
  preferredRoles: [
    'Frontend Lead',
    'UI/UX Designer',
    'Full Stack Developer'
  ],
  interests: [
    'EdTech & Learning Tools',
    'Healthcare Informatics',
    'Collaborative Software',
    'Design Systems & Accessibility',
    'Open Source'
  ],
  skills: [
    { name: 'React', level: 'Advanced', years: 2.5 },
    { name: 'JavaScript (ES6+)', level: 'Advanced', years: 3 },
    { name: 'UI/UX Design (Figma)', level: 'Advanced', years: 2 },
    { name: 'Node.js', level: 'Intermediate', years: 1.5 },
    { name: 'TypeScript', level: 'Intermediate', years: 1 },
    { name: 'Tailwind & Bootstrap CSS', level: 'Advanced', years: 2.5 },
    { name: 'REST APIs & Axios', level: 'Intermediate', years: 2 },
    { name: 'Python', level: 'Beginner', years: 1 }
  ],
  stats: {
    activeTeams: 2,
    completedProjects: 4,
    compatibilityMatches: 18,
    pendingApplications: 3
  }
};

export const allStudents = [
  currentStudent,
  {
    id: 'std-102',
    name: 'Sarah Lin',
    email: 'sarah.lin@university.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    headline: 'Senior Data Science & Machine Learning Major',
    department: 'Data Science & Statistics',
    year: 'Senior (Year 4)',
    preferredRoles: ['ML Engineer', 'Data Analyst'],
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'PyTorch', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Advanced' }
    ],
    availability: { hoursPerWeek: 12, status: 'Open to Collaborations' }
  },
  {
    id: 'std-103',
    name: 'Marcus Thorne',
    email: 'marcus.t@university.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    headline: 'Junior Software Engineering Major',
    department: 'Computer Science',
    year: 'Junior (Year 3)',
    preferredRoles: ['Backend Engineer', 'DevOps Lead'],
    skills: [
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Advanced' }
    ],
    availability: { hoursPerWeek: 16, status: 'Actively Looking' }
  },
  {
    id: 'std-104',
    name: 'Elena Rostova',
    email: 'elena.r@university.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    headline: 'Senior Interaction Design & Media Studies Major',
    department: 'Design & Media Arts',
    year: 'Senior (Year 4)',
    preferredRoles: ['Product Designer', 'Design Researcher'],
    skills: [
      { name: 'Figma', level: 'Advanced' },
      { name: 'User Testing', level: 'Advanced' },
      { name: 'Design Systems', level: 'Intermediate' }
    ],
    availability: { hoursPerWeek: 14, status: 'Actively Looking' }
  }
];
