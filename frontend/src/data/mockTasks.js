export const initialTasks = [
  {
    id: 'task-101',
    teamId: 'team-1',
    title: 'Implement Dark Mode Syntax Highlighting',
    description: 'Ensure PrismJS / Monaco themes switch seamlessly between navy and daylight palettes with high contrast.',
    status: 'todo',
    priority: 'Medium',
    assignee: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 14, 2026',
    tag: 'Frontend'
  },
  {
    id: 'task-102',
    teamId: 'team-1',
    title: 'Design Inline Code Comment Pin Component',
    description: 'Create an expandable floating pin in Figma and build the React popover component for line-by-line TA critiques.',
    status: 'in-progress',
    priority: 'High',
    assignee: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 12, 2026',
    tag: 'UI/UX'
  },
  {
    id: 'task-103',
    teamId: 'team-1',
    title: 'Stress-test WebSocket room broadcasting',
    description: 'Simulate 25 concurrent typers per room to verify conflict-free CRDT synchronization latency under 80ms.',
    status: 'review',
    priority: 'High',
    assignee: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 10, 2026',
    tag: 'Backend'
  },
  {
    id: 'task-104',
    teamId: 'team-1',
    title: 'Setup GitHub Actions CI for linting and Vite build',
    description: 'Automatic PR verification and bundle analysis on main branch merges.',
    status: 'done',
    priority: 'Low',
    assignee: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 03, 2026',
    tag: 'DevOps'
  },
  {
    id: 'task-105',
    teamId: 'team-1',
    title: 'Audio Chat Fallback WebRTC Signaling Server',
    description: 'Add STUN/TURN fallback server configuration for peer connections behind university firewalls.',
    status: 'todo',
    priority: 'Medium',
    assignee: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 18, 2026',
    tag: 'Networking'
  },
  {
    id: 'task-106',
    teamId: 'team-2',
    title: 'Build Infinite Canvas Pan and Zoom gestures',
    description: 'Implement smooth 60fps wheel zooming and touch pinch gestures for mobile & trackpad users.',
    status: 'in-progress',
    priority: 'High',
    assignee: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 16, 2026',
    tag: 'Canvas'
  },
  {
    id: 'task-107',
    teamId: 'team-2',
    title: 'Markdown formula parser with KaTeX integration',
    description: 'Support math equations inside shared study notes with live rendered preview.',
    status: 'done',
    priority: 'Medium',
    assignee: {
      name: 'Liam Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
    },
    dueDate: 'Nov 05, 2026',
    tag: 'Frontend'
  }
];

export const taskColumns = [
  { id: 'todo', title: 'To Do', badgeClass: 'bg-secondary' },
  { id: 'in-progress', title: 'In Progress', badgeClass: 'bg-primary' },
  { id: 'review', title: 'In Review', badgeClass: 'bg-warning text-dark' },
  { id: 'done', title: 'Done', badgeClass: 'bg-success' }
];
