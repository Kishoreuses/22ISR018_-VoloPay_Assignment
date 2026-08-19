import { Member, Activity, AIRecommendationResponse, FoFSpace, Invitee } from './types';
import { MemberModel, ActivityModel, InviteeModel } from './models';
import { getSeededMembers, INITIAL_ACTIVITIES, SEED_INVITEES } from './seedData';
import { calculateMemberState } from './activityEngine';
import mongoose from 'mongoose';

// ─── In-memory fallback ───────────────────────────────────────────────────────
let memMembers: Member[] = getSeededMembers();
let memActivities: Activity[] = [...INITIAL_ACTIVITIES];
let memInvitees: Invitee[] = JSON.parse(JSON.stringify(SEED_INVITEES));

const useDB = () => mongoose.connection.readyState === 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildMember(raw: any, allActivities: any[]): Member {
  const acts: Activity[] = allActivities
    .filter((a: any) => a.memberId === raw.id)
    .map((a: any) => ({
      id: a.id, memberId: a.memberId, date: a.date,
      space: a.space, activityType: a.activityType, description: a.description
    }));
  const calc = calculateMemberState(raw.joinDate, acts);
  return {
    id: raw.id, fullName: raw.fullName, jobRole: raw.jobRole,
    company: raw.company, joinDate: raw.joinDate, relevantSpace: raw.relevantSpace,
    owner: raw.owner || 'Unassigned', nextAction: raw.nextAction || '',
    followUpRequired: Boolean(raw.followUpRequired), notes: raw.notes || '',
    ...calc,
    activities: acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  };
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
export async function ensureSeeded() {
  if (useDB()) {
    const count = await MemberModel.countDocuments();
    if (count === 0) {
      await MemberModel.insertMany(getSeededMembers());
      await ActivityModel.insertMany(INITIAL_ACTIVITIES);
    }
    const invCount = await InviteeModel.countDocuments();
    if (invCount === 0) {
      await InviteeModel.insertMany(SEED_INVITEES);
    }
  }
}


// ─── Read ─────────────────────────────────────────────────────────────────────
export async function getAllMembers(): Promise<Member[]> {
  if (useDB()) {
    const rawM = await MemberModel.find({}).lean();
    const rawA = await ActivityModel.find({}).lean();
    return rawM.map((m: any) => buildMember(m, rawA));
  }
  return memMembers.map(m => {
    const acts = memActivities.filter(a => a.memberId === m.id);
    const calc = calculateMemberState(m.joinDate, acts);
    return { ...m, ...calc, activities: acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
  });
}

export async function getMemberById(id: string): Promise<Member | null> {
  const all = await getAllMembers();
  return all.find(m => m.id === id) || null;
}

// ─── Create Member ────────────────────────────────────────────────────────────
export async function createMember(data: Omit<Member, 'id' | 'activityState' | 'lastActivityDate' | 'activityCount' | 'activities'>): Promise<Member> {
  const newId = `mem_${Date.now()}`;
  const calc = calculateMemberState(data.joinDate, []);
  const newMember: Member = { ...data, id: newId, ...calc, activityCount: 0 };
  if (useDB()) { await MemberModel.create(newMember); }
  memMembers = [newMember, ...memMembers];
  return newMember;
}

// ─── Update Member ────────────────────────────────────────────────────────────
export async function updateMember(id: string, updates: Partial<Member>): Promise<Member | null> {
  if (useDB()) { await MemberModel.updateOne({ id }, { $set: updates }); }
  memMembers = memMembers.map(m => m.id === id ? { ...m, ...updates } : m);
  return getMemberById(id);
}

// ─── Add Activity ─────────────────────────────────────────────────────────────
export async function addActivity(data: Omit<Activity, 'id'>): Promise<{ activity: Activity; updatedMember: Member }> {
  const newAct: Activity = { ...data, id: `act_${Date.now()}` };
  if (useDB()) { await ActivityModel.create(newAct); }
  memActivities = [newAct, ...memActivities];
  const updatedMember = (await getMemberById(data.memberId))!;
  if (useDB()) {
    await MemberModel.updateOne({ id: updatedMember.id }, {
      $set: { activityState: updatedMember.activityState, lastActivityDate: updatedMember.lastActivityDate, activityCount: updatedMember.activityCount }
    });
  }
  return { activity: newAct, updatedMember };
}

// ─── All Activities ───────────────────────────────────────────────────────────
export async function getAllActivities(): Promise<Activity[]> {
  if (useDB()) {
    const raw = await ActivityModel.find({}).sort({ date: -1 }).lean();
    return raw.map((a: any) => ({ id: a.id, memberId: a.memberId, date: a.date, space: a.space, activityType: a.activityType, description: a.description }));
  }
  return [...memActivities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const members = await getAllMembers();
  const activities = await getAllActivities();
  return {
    totalMembers: members.length,
    newlyJoinedCount: members.filter(m => m.activityState === 'Newly Joined').length,
    activeCount: members.filter(m => m.activityState === 'Active').length,
    highlyActiveCount: members.filter(m => m.activityState === 'Highly Active').length,
    atRiskCount: members.filter(m => m.activityState === 'At Risk').length,
    dormantCount: members.filter(m => m.activityState === 'Dormant').length,
    totalActivitiesCount: activities.length,
    followUpsRequiredCount: members.filter(m => m.followUpRequired).length
  };
}

// ─── Reset Seed ───────────────────────────────────────────────────────────────
export async function resetToSeed() {
  if (useDB()) {
    await MemberModel.deleteMany({});
    await ActivityModel.deleteMany({});
    await InviteeModel.deleteMany({});
    await MemberModel.insertMany(getSeededMembers());
    await ActivityModel.insertMany(INITIAL_ACTIVITIES);
    await InviteeModel.insertMany(SEED_INVITEES);
  }
  memMembers = getSeededMembers();
  memActivities = [...INITIAL_ACTIVITIES];
  memInvitees = JSON.parse(JSON.stringify(SEED_INVITEES));
}

// ─── AI Recommendation ────────────────────────────────────────────────────────
export function generateAIRecommendation(member: Member): AIRecommendationResponse {
  const activities = member.activities || [];
  const spaceCounts: Record<string, number> = {};
  activities.forEach(a => { spaceCounts[a.space] = (spaceCounts[a.space] || 0) + 1; });
  const sortedSpaces = Object.entries(spaceCounts).sort((a, b) => b[1] - a[1]);
  const primarySpace: FoFSpace = (sortedSpaces[0]?.[0] || member.relevantSpace) as FoFSpace;

  let activitySummary = activities.length === 0
    ? `Member joined on ${member.joinDate} and has no recorded community activity yet.`
    : `Member has recorded ${activities.length} total activities. Key areas: ${sortedSpaces.map(([s, c]) => `${s} (${c})`).join(', ')}. Last active on ${member.lastActivityDate}.`;

  let suggestedSpace: FoFSpace = primarySpace;
  let suggestedNextAction = '';
  let reasoning = '';

  switch (member.activityState) {
    case 'Newly Joined':
      suggestedSpace = 'Say Hello';
      suggestedNextAction = `Send a warm 1:1 welcome message and invite ${member.fullName} to introduce themselves in Say Hello.`;
      reasoning = `Member joined within the last 7 days. Early engagement in Say Hello increases 30-day retention significantly.`;
      break;
    case 'Highly Active':
      suggestedSpace = spaceCounts['Finance Workflows'] ? 'Templates & Resources' : 'Interviews & Stories';
      suggestedNextAction = spaceCounts['Finance Workflows']
        ? `Invite ${member.fullName} to co-author a workflow template in Templates & Resources.`
        : `Invite ${member.fullName} to be featured in a FoF peer spotlight interview.`;
      reasoning = `High engagement across ${sortedSpaces.length} spaces. Well-positioned to contribute community assets.`;
      break;
    case 'Active':
      suggestedSpace = spaceCounts['Ask Finance Peers'] ? 'Tools & Systems' : 'Finance Workflows';
      suggestedNextAction = spaceCounts['Ask Finance Peers']
        ? `Suggest ${member.fullName} explore active threads in Tools & Systems.`
        : `Tag ${member.fullName} in a relevant Finance Workflows thread.`;
      reasoning = `Member has 2+ recent activities. Targeted thread engagement deepens peer participation.`;
      break;
    case 'At Risk':
      suggestedSpace = primarySpace;
      suggestedNextAction = `Send a friendly 1:1 check-in referencing their prior contribution in ${primarySpace} and share a recent trending discussion.`;
      reasoning = `No activity for 15-30 days. Targeted outreach referencing past engagement is effective for re-engagement.`;
      break;
    default:
      suggestedSpace = 'Ask Finance Peers';
      suggestedNextAction = `Send a curated community digest with top 3 peer discussions from Ask Finance Peers.`;
      reasoning = `Member has been dormant for >30 days. A digest provides immediate value without demanding high re-engagement effort.`;
  }

  return {
    memberId: member.id, memberName: member.fullName, activitySummary,
    suggestedSpace, suggestedNextAction, reasoning, isSimulated: true,
    disclaimer: 'AI-assisted recommendation — Human review required. Recommendations do not execute automatic actions or messaging.'
  };
}

// ─── Invitees ─────────────────────────────────────────────────────────────────
export async function getAllInvitees(): Promise<Invitee[]> {
  if (useDB()) {
    const raw = await InviteeModel.find({}).lean();
    return raw.map((inv: any) => ({
      id: inv.id,
      fullName: inv.fullName,
      jobRole: inv.jobRole,
      company: inv.company,
      publicSignal: inv.publicSignal,
      valueProposition: inv.valueProposition,
      contribution: inv.contribution,
      relevantSpace: inv.relevantSpace,
      source: inv.source,
      scores: {
        relevance: inv.scores.relevance,
        contribution: inv.scores.contribution,
        value: inv.scores.value,
        evidence: inv.scores.evidence,
        total: inv.scores.total
      },
      outreachStatus: inv.outreachStatus,
      isPriority: inv.isPriority
    }));
  }
  return memInvitees;
}

export async function getInviteeById(id: string): Promise<Invitee | null> {
  const all = await getAllInvitees();
  return all.find(i => i.id === id) || null;
}

export async function updateInviteeStatus(id: string, outreachStatus: string): Promise<Invitee | null> {
  if (useDB()) {
    await InviteeModel.updateOne({ id }, { $set: { outreachStatus } });
  }
  memInvitees = memInvitees.map(i => i.id === id ? { ...i, outreachStatus: outreachStatus as any } : i);
  return getInviteeById(id);
}

