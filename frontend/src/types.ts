export type ActivityState = 'Newly Joined' | 'Active' | 'Highly Active' | 'At Risk' | 'Dormant';

export type FoFSpace =
  | 'Start Here' | 'Say Hello' | 'Announcements' | 'FoF Support' | 'FAQs'
  | 'Ask Finance Peers' | 'Finance Workflows' | 'Tools & Systems' | 'Career & Compensation' | 'Water Cooler'
  | 'Interviews & Stories' | 'Templates & Resources' | 'Curated Jobs';

export type ActivityType = 'Joined Community' | 'Introduction' | 'Post' | 'Comment' | 'Resource Download' | 'Template Share' | 'Event Attendance';

export interface Activity {
  id: string;
  memberId: string;
  date: string;
  space: FoFSpace;
  activityType: ActivityType;
  description: string;
}

export interface Member {
  id: string;
  fullName: string;
  jobRole: string;
  company: string;
  joinDate: string;
  relevantSpace: FoFSpace;
  activityState: ActivityState;
  lastActivityDate: string;
  activityCount: number;
  owner: string;
  nextAction: string;
  followUpRequired: boolean;
  notes: string;
  activities?: Activity[];
}

export interface DashboardStats {
  totalMembers: number;
  newlyJoinedCount: number;
  activeCount: number;
  highlyActiveCount: number;
  atRiskCount: number;
  dormantCount: number;
  totalActivitiesCount: number;
  followUpsRequiredCount: number;
}

export interface AIRecommendationResponse {
  memberId: string;
  memberName: string;
  activitySummary: string;
  suggestedSpace: FoFSpace;
  suggestedNextAction: string;
  reasoning: string;
  isSimulated: boolean;
  disclaimer: string;
}

export interface Invitee {
  id: string;
  fullName: string;
  jobRole: string;
  company: string;
  publicSignal: string;
  valueProposition: string;
  contribution: string;
  relevantSpace: string;
  source: string;
  scores: {
    relevance: number;
    contribution: number;
    value: number;
    evidence: number;
    total: number;
  };
  outreachStatus: 'Not Started' | 'Touch 1 Sent' | 'Touch 2 Sent' | 'Touch 3 Sent' | 'Touch 4 Sent' | 'Touch 5 Sent' | 'Situation A Managed' | 'Situation B Managed' | 'Closed';
  isPriority: boolean;
}

export const ALL_FOF_SPACES: FoFSpace[] = [
  'Start Here', 'Say Hello', 'Announcements', 'FoF Support', 'FAQs',
  'Ask Finance Peers', 'Finance Workflows', 'Tools & Systems', 'Career & Compensation', 'Water Cooler',
  'Interviews & Stories', 'Templates & Resources', 'Curated Jobs'
];

export const FOF_SPACES_BY_CATEGORY: Record<string, FoFSpace[]> = {
  'WELCOME': ['Start Here', 'Say Hello', 'Announcements', 'FoF Support', 'FAQs'],
  'DISCUSSIONS': ['Ask Finance Peers', 'Finance Workflows', 'Tools & Systems', 'Career & Compensation', 'Water Cooler'],
  'RESOURCES': ['Interviews & Stories', 'Templates & Resources'],
  'CAREERS': ['Curated Jobs']
};

export const ACTIVITY_TYPES: ActivityType[] = [
  'Joined Community', 'Introduction', 'Post', 'Comment', 'Resource Download', 'Template Share', 'Event Attendance'
];

export const COMMUNITY_OWNERS = [
  'Kishore (Community Lead)', 'Sarah Jenkins (Member Success)', 'Alex Rivera (Growth Lead)', 'Unassigned'
];

export const FINANCE_ROLES = [
  'FP&A Manager', 'Finance Manager', 'Controller', 'Treasury Analyst', 'AP Manager',
  'AR Manager', 'Finance Operations Lead', 'Finance Systems Manager', 'Accounting Manager',
  'Finance Director', 'VP of Finance', 'Strategic Finance Lead', 'Corporate Development Analyst',
  'Senior Accountant', 'Head of Revenue Ops'
];

export const ACTIVITY_STATE_DESCRIPTIONS: Record<ActivityState, string> = {
  'Newly Joined': 'Joined within the last 7 days with limited initial activity (< 2 actions in 30 days).',
  'Active': 'At least 2 meaningful activities within the last 30 days.',
  'Highly Active': 'At least 4 meaningful activities within the last 30 days across at least 2 different spaces.',
  'At Risk': 'Previously active member with no activity for approximately 15–30 days.',
  'Dormant': 'No recorded community activity for more than 30 days.'
};
