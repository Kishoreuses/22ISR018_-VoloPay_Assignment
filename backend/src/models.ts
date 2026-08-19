import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  id: string;
  fullName: string;
  jobRole: string;
  company: string;
  joinDate: string;
  relevantSpace: string;
  activityState: string;
  lastActivityDate: string;
  activityCount: number;
  owner: string;
  nextAction: string;
  followUpRequired: boolean;
  notes: string;
}

const MemberSchema = new Schema<IMember>({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  jobRole: { type: String, required: true },
  company: { type: String, required: true },
  joinDate: { type: String, required: true },
  relevantSpace: { type: String, required: true },
  activityState: { type: String, required: true },
  lastActivityDate: { type: String, required: true },
  activityCount: { type: Number, default: 0 },
  owner: { type: String, default: 'Unassigned' },
  nextAction: { type: String, default: '' },
  followUpRequired: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

export const MemberModel = mongoose.models?.Member || mongoose.model<IMember>('Member', MemberSchema);

export interface IActivity extends Document {
  id: string;
  memberId: string;
  date: string;
  space: string;
  activityType: string;
  description: string;
}

const ActivitySchema = new Schema<IActivity>({
  id: { type: String, required: true, unique: true },
  memberId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  space: { type: String, required: true },
  activityType: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

export const ActivityModel = mongoose.models?.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export interface IInvitee extends Document {
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
  outreachStatus: string;
  isPriority: boolean;
}

const InviteeSchema = new Schema<IInvitee>({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  jobRole: { type: String, required: true },
  company: { type: String, required: true },
  publicSignal: { type: String, required: true },
  valueProposition: { type: String, required: true },
  contribution: { type: String, required: true },
  relevantSpace: { type: String, required: true },
  source: { type: String, required: true },
  scores: {
    relevance: { type: Number, required: true },
    contribution: { type: Number, required: true },
    value: { type: Number, required: true },
    evidence: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  outreachStatus: { type: String, default: 'Not Started' },
  isPriority: { type: Boolean, default: false }
}, { timestamps: true });

export const InviteeModel = mongoose.models?.Invitee || mongoose.model<IInvitee>('Invitee', InviteeSchema);

