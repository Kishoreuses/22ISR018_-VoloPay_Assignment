import { Router, Request, Response } from 'express';
import {
  getAllMembers, getMemberById, createMember, updateMember,
  addActivity, getAllActivities, getDashboardStats, resetToSeed, generateAIRecommendation, ensureSeeded,
  getAllInvitees, getInviteeById, updateInviteeStatus
} from './store';

const router = Router();

// ─── Dashboard ───────────────────────────────────────────────────────────────
router.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Members ─────────────────────────────────────────────────────────────────
router.get('/members', async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    let members = await getAllMembers();
    const { search, state, space, owner, followUp } = req.query as Record<string, string>;
    if (search) {
      const q = search.toLowerCase();
      members = members.filter(m =>
        m.fullName.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.jobRole.toLowerCase().includes(q)
      );
    }
    if (state && state !== 'All') members = members.filter(m => m.activityState === state);
    if (space && space !== 'All') members = members.filter(m => m.relevantSpace === space);
    if (owner && owner !== 'All') members = members.filter(m => m.owner === owner);
    if (followUp === 'true') members = members.filter(m => m.followUpRequired);
    if (followUp === 'false') members = members.filter(m => !m.followUpRequired);
    res.json({ success: true, count: members.length, data: members });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/members', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.fullName || !body.jobRole || !body.company || !body.relevantSpace) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const newMember = await createMember({
      fullName: body.fullName, jobRole: body.jobRole, company: body.company,
      joinDate: body.joinDate || new Date().toISOString().split('T')[0],
      relevantSpace: body.relevantSpace, owner: body.owner || 'Unassigned',
      nextAction: body.nextAction || 'Send welcome intro',
      followUpRequired: body.followUpRequired ?? true, notes: body.notes || ''
    });
    res.status(201).json({ success: true, data: newMember });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/members/:id', async (req: Request, res: Response) => {
  try {
    const member = await getMemberById(req.params.id);
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.put('/members/:id', async (req: Request, res: Response) => {
  try {
    const updated = await updateMember(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Member not found' });
    res.json({ success: true, data: updated });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Activities ───────────────────────────────────────────────────────────────
router.get('/activities', async (_req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const activities = await getAllActivities();
    res.json({ success: true, count: activities.length, data: activities });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/activities', async (req: Request, res: Response) => {
  try {
    const { memberId, space, activityType, description, date } = req.body;
    if (!memberId || !space || !activityType || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const result = await addActivity({
      memberId, space, activityType, description,
      date: date || new Date().toISOString().split('T')[0]
    });
    res.status(201).json({ success: true, data: result });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── AI Recommendation ────────────────────────────────────────────────────────
router.post('/ai-recommend', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ success: false, error: 'Member ID required' });
    const member = await getMemberById(memberId);
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    const recommendation = generateAIRecommendation(member);
    res.json({ success: true, data: recommendation });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Seed Reset ───────────────────────────────────────────────────────────────
router.post('/seed', async (_req: Request, res: Response) => {
  try {
    await resetToSeed();
    res.json({ success: true, message: 'Data reset to fictional seed successfully' });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Invitees (Task 1 & 2 Sourcing) ──────────────────────────────────────────
router.get('/invitees', async (_req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const invitees = await getAllInvitees();
    res.json({ success: true, data: invitees });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/invitees/:id', async (req: Request, res: Response) => {
  try {
    const invitee = await getInviteeById(req.params.id);
    if (!invitee) return res.status(404).json({ success: false, error: 'Invitee not found' });
    res.json({ success: true, data: invitee });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

router.put('/invitees/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await updateInviteeStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, error: 'Invitee not found' });
    res.json({ success: true, data: updated });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

export default router;
