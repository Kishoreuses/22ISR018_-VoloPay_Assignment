export type ActivityState =
  | 'Newly Joined'
  | 'Active'
  | 'Highly Active'
  | 'At Risk'
  | 'Dormant';

export type FoFSpace =
  | 'Start Here'
  | 'Say Hello'
  | 'Announcements'
  | 'FoF Support'
  | 'FAQs'
  | 'Ask Finance Peers'
  | 'Finance Workflows'
  | 'Tools & Systems'
  | 'Career & Compensation'
  | 'Water Cooler'
  | 'Interviews & Stories'
  | 'Templates & Resources'
  | 'Curated Jobs';

export type ActivityType =
  | 'Joined Community'
  | 'Introduction'
  | 'Post'
  | 'Comment'
  | 'Resource Download'
  | 'Template Share'
  | 'Event Attendance';

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
