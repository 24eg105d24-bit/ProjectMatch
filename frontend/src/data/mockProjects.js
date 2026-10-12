export const mockProjects = [
  {
    id: 'proj-1',
    title: 'CampusPulse: Student Wellbeing & Mental Health Companion',
    tagline: 'A private, student-centered wellbeing tracking and university resource matching app.',
    category: 'Healthcare & EdTech',
    status: 'Recruiting',
    lead: {
      id: 'std-102',
      name: 'Sarah Lin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      role: 'Project Lead / Data Scientist'
    },
    teamSize: {
      current: 2,
      max: 4
    },
    members: [
      { id: 'std-102', name: 'Sarah Lin', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-105', name: 'Devon Miles', role: 'Backend Developer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' }
    ],
    requiredSkills: ['React', 'UI/UX Design (Figma)', 'Node.js', 'Data Visualization', 'REST APIs'],
    openRoles: ['Frontend Architect', 'UI/UX Designer'],
    description: 'CampusPulse tackles collegiate mental wellness by offering students encrypted mood journaling, anonymized peer-support connections, and direct routing to on-campus counseling resources. The team needs a frontend lead proficient with modern React and accessible UX patterns.',
    timeline: {
      term: 'Fall 2026 - Spring 2027',
      deadline: 'Midterm Prototype Review: Nov 28, 2026',
      weeklyCommitment: '12-15 hrs/week'
    },
    milestones: [
      { title: 'User Research & Wireframes', status: 'Completed', date: 'Oct 2026' },
      { title: 'Core React Component Library & Auth UI', status: 'In Progress', date: 'Nov 2026' },
      { title: 'Interactive Mood Analytics & Resource Index', status: 'Upcoming', date: 'Dec 2026' },
      { title: 'Beta Testing with Campus Wellness Center', status: 'Upcoming', date: 'Feb 2027' }
    ],
    tags: ['Mental Health', 'React', 'Figma', 'Accessible UI', 'Social Impact']
  },
  {
    id: 'proj-2',
    title: 'EcoTrack: University Sustainability & Food Waste Dashboard',
    tagline: 'IoT-connected dining hall food waste quantification and smart redistribution platform.',
    category: 'GreenTech',
    status: 'Recruiting',
    lead: {
      id: 'std-103',
      name: 'Marcus Thorne',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      role: 'Hardware & Backend Lead'
    },
    teamSize: {
      current: 3,
      max: 5
    },
    members: [
      { id: 'std-103', name: 'Marcus Thorne', role: 'Backend Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-106', name: 'Priya Sharma', role: 'IoT & Firmware Engineer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-107', name: 'Jordan Bell', role: 'Data Analyst', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80' }
    ],
    requiredSkills: ['React', 'JavaScript (ES6+)', 'PostgreSQL', 'Tailwind & Bootstrap CSS', 'Chart.js'],
    openRoles: ['Frontend Developer', 'UX/Data Visualizer'],
    description: 'EcoTrack integrates with university dining scales to track daily surplus food, generate reduction insights for chefs, and facilitate instant notification to food-insecure campus organizations.',
    timeline: {
      term: 'Academic Year 2026-2027',
      deadline: 'Sustainability Grant Showcase: Dec 15, 2026',
      weeklyCommitment: '10-14 hrs/week'
    },
    milestones: [
      { title: 'Scale Sensor Integration Testing', status: 'Completed', date: 'Sep 2026' },
      { title: 'Database Schema & Node.js API', status: 'Completed', date: 'Oct 2026' },
      { title: 'Student & Kitchen Staff Web Portals', status: 'In Progress', date: 'Nov 2026' },
      { title: 'Pilot Rollout at North Dining Hall', status: 'Upcoming', date: 'Jan 2027' }
    ],
    tags: ['Sustainability', 'IoT', 'React', 'Analytics', 'Campus Impact']
  },
  {
    id: 'proj-3',
    title: 'CodeCollab: Real-Time Peer Code Review & Pair Programming Room',
    tagline: 'Collaborative in-browser IDE with granular feedback pins and synchronized audio-text chat.',
    category: 'Developer Tools',
    status: 'In Progress',
    lead: {
      id: 'std-104',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      role: 'Product Lead'
    },
    teamSize: {
      current: 3,
      max: 4
    },
    members: [
      { id: 'std-101', name: 'Alex Chen', role: 'Frontend Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-104', name: 'Elena Rostova', role: 'Product Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-108', name: 'Kenji Sato', role: 'Systems Engineer', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80' }
    ],
    requiredSkills: ['React', 'TypeScript', 'WebSockets', 'Tailwind & Bootstrap CSS'],
    openRoles: ['Full Stack Developer'],
    description: 'CodeCollab simplifies how computer science teaching assistants and students conduct live code reviews, with line-by-line interactive commenting, virtual whiteboard overlays, and syntax highlighting.',
    timeline: {
      term: 'Fall 2026',
      deadline: 'Final Capstone Expo: Dec 10, 2026',
      weeklyCommitment: '15 hrs/week'
    },
    milestones: [
      { title: 'CRDT Conflict-Free Text Synchronization', status: 'Completed', date: 'Oct 2026' },
      { title: 'Syntax Highlighter & Audio Channel', status: 'Completed', date: 'Oct 2026' },
      { title: 'Interactive Comment Threads & Review Board', status: 'In Progress', date: 'Nov 2026' },
      { title: 'Final System Stress Testing', status: 'Upcoming', date: 'Dec 2026' }
    ],
    tags: ['WebSockets', 'React', 'DevTools', 'Education', 'Real-time']
  },
  {
    id: 'proj-4',
    title: 'FinLearn: Gamified Financial Literacy Platform for Undergrads',
    tagline: 'Interactive micro-simulations covering student loans, taxes, budgeting, and compound interest.',
    category: 'FinTech & EdTech',
    status: 'Recruiting',
    lead: {
      id: 'std-109',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
      role: 'Project Lead / Economics & CS'
    },
    teamSize: {
      current: 1,
      max: 3
    },
    members: [
      { id: 'std-109', name: 'David Kim', role: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80' }
    ],
    requiredSkills: ['React', 'UI/UX Design (Figma)', 'JavaScript (ES6+)', 'Interactive Animations'],
    openRoles: ['Frontend Developer', 'UI/UX Designer'],
    description: 'FinLearn teaches college students pragmatic personal finance through bite-sized branching scenarios, simulated paycheck deduction calculators, and savings challenges.',
    timeline: {
      term: 'Spring 2027',
      deadline: 'Campus Pitch Competition: Jan 22, 2027',
      weeklyCommitment: '10-12 hrs/week'
    },
    milestones: [
      { title: 'Financial Curriculum Formulation', status: 'Completed', date: 'Oct 2026' },
      { title: 'Gamified UI Prototypes', status: 'In Progress', date: 'Nov 2026' },
      { title: 'Web App Engine & State Storage', status: 'Upcoming', date: 'Dec 2026' }
    ],
    tags: ['FinTech', 'Gamification', 'React', 'Student Finance']
  },
  {
    id: 'proj-5',
    title: 'RoboNav: Autonomous Campus Rover Web Telemetry Console',
    tagline: 'Mission control dashboard for live tracking, video streaming, and obstacle map telemetry.',
    category: 'Robotics & Web',
    status: 'Recruiting',
    lead: {
      id: 'std-110',
      name: 'Aisha Patel',
      avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd25218?auto=format&fit=crop&w=250&q=80',
      role: 'Robotics Lead'
    },
    teamSize: {
      current: 3,
      max: 4
    },
    members: [
      { id: 'std-110', name: 'Aisha Patel', role: 'Robotics Lead', avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd25218?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-111', name: 'Lucas Meyer', role: 'ROS2 / Embedded Engineer', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-112', name: 'Chloe Dubois', role: 'Computer Vision Engineer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' }
    ],
    requiredSkills: ['React', 'JavaScript (ES6+)', 'REST APIs & Axios', 'Mapbox/Leaflet', 'WebRTC'],
    openRoles: ['Frontend Dashboard Specialist'],
    description: 'RoboNav connects an autonomous physical campus rover with an operator dashboard featuring real-time LiDAR map streaming, waypoint creation, battery monitoring, and collision override controls.',
    timeline: {
      term: 'Academic Year 2026-2027',
      deadline: 'Field Demonstration: Dec 5, 2026',
      weeklyCommitment: '14 hrs/week'
    },
    milestones: [
      { title: 'Robot Chassis & Sensor Assembly', status: 'Completed', date: 'Sep 2026' },
      { title: 'WebRTC Low-Latency Video Bridge', status: 'Completed', date: 'Oct 2026' },
      { title: 'Telemetry Web UI & Joystick Controls', status: 'In Progress', date: 'Nov 2026' },
      { title: 'Full Outdoor Autonomous Navigation Trial', status: 'Upcoming', date: 'Dec 2026' }
    ],
    tags: ['Robotics', 'WebRTC', 'React', 'Telemetry', 'IoT']
  },
  {
    id: 'proj-6',
    title: 'StudySync: Collaborative Whiteboard & Distributed Study Hub',
    tagline: 'Virtual study hall with synchronous markdown notes, formula rendering, and flashcards.',
    category: 'EdTech',
    status: 'In Progress',
    lead: {
      id: 'std-113',
      name: 'Liam Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      role: 'Product Lead'
    },
    teamSize: {
      current: 2,
      max: 4
    },
    members: [
      { id: 'std-101', name: 'Alex Chen', role: 'UI/UX & Frontend', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
      { id: 'std-113', name: 'Liam Johnson', role: 'Full Stack Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' }
    ],
    requiredSkills: ['React', 'UI/UX Design (Figma)', 'Node.js', 'Canvas API'],
    openRoles: ['Full Stack Developer', 'Data Persistence Specialist'],
    description: 'StudySync brings remote classmates together with shared canvas sketching, instant latex rendering, audio study spaces, and intelligent flashcard scheduling for midterm preparations.',
    timeline: {
      term: 'Fall 2026',
      deadline: 'Final Release: Dec 18, 2026',
      weeklyCommitment: '12 hrs/week'
    },
    milestones: [
      { title: 'Infinite Canvas Engine Implementation', status: 'Completed', date: 'Sep 2026' },
      { title: 'Shared Markdown & LaTeX Parser', status: 'Completed', date: 'Oct 2026' },
      { title: 'Integrated Audio Channels & Timers', status: 'In Progress', date: 'Nov 2026' },
      { title: 'Student Usability Benchmark Testing', status: 'Upcoming', date: 'Dec 2026' }
    ],
    tags: ['EdTech', 'Canvas', 'React', 'Collaborative', 'Flashcards']
  }
];
