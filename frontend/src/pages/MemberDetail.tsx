import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, FileText, User, Sparkles, ShieldAlert, Plus, CheckCircle, HelpCircle } from 'lucide-react';
import Layout from '../components/Layout';
import StateBadge from '../components/StateBadge';
import { api } from '../api';
import { Member, ALL_FOF_SPACES, COMMUNITY_OWNERS, ACTIVITY_TYPES, AIRecommendationResponse } from '../types';

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [owner, setOwner] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Log Activity Form
  const [logOpen, setLogOpen] = useState(false);
  const [actSpace, setActSpace] = useState('Say Hello');
  const [actType, setActType] = useState('Comment');
  const [actDesc, setActDesc] = useState('');
  const [actDate, setActDate] = useState('2026-08-19');

  // AI Recommendation
  const [aiRec, setAiRec] = useState<AIRecommendationResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchMemberData = () => {
    if (!id) return;
    setLoading(true);
    api.getMember(id)
      .then(res => {
        const m = res as Member;
        setMember(m);
        setOwner(m.owner || 'Unassigned');
        setNextAction(m.nextAction || '');
        setFollowUpRequired(m.followUpRequired);
        setNotes(m.notes || '');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMemberData();
    setAiRec(null);
  }, [id]);

  const handleUpdateMember = () => {
    if (!id) return;
    setSaving(true);
    api.updateMember(id, { owner, nextAction, followUpRequired, notes })
      .then(() => fetchMemberData())
      .finally(() => setSaving(false));
  };

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !actDesc) return;
    api.createActivity({
      memberId: id,
      space: actSpace,
      activityType: actType,
      description: actDesc,
      date: actDate
    }).then(() => {
      setLogOpen(false);
      setActDesc('');
      fetchMemberData();
    });
  };

  const handleFetchAI = () => {
    if (!id) return;
    setLoadingAI(true);
    api.getAIRecommendation(id)
      .then(res => setAiRec(res as AIRecommendationResponse))
      .finally(() => setLoadingAI(false));
  };

  const handleAcceptAI = () => {
    if (!id || !aiRec) return;
    setSaving(true);
    api.updateMember(id, {
      relevantSpace: aiRec.suggestedSpace,
      nextAction: aiRec.suggestedNextAction
    }).then(() => {
      fetchMemberData();
      setAiRec(null);
    }).finally(() => setSaving(false));
  };

  if (loading) return (
    <Layout title="Member Profile" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    </Layout>
  );

  if (!member) return (
    <Layout title="Member Profile" subtitle="Error">
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">Member not found.</div>
    </Layout>
  );

  return (
    <Layout
      title={member.fullName}
      subtitle={`${member.jobRole} at ${member.company}`}
      actions={
        <Link to="/members" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium">
          <ChevronLeft size={16} /> Back to Directory
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Metadata & CRM Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Community Metadata</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Join Date</div>
                <div className="text-sm font-medium text-slate-800">{member.joinDate}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Current State</div>
                <div className="mt-1"><StateBadge state={member.activityState} size="sm" /></div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Last Active Date</div>
                <div className="text-sm font-medium text-slate-800">{member.lastActivityDate}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Activities</div>
                <div className="text-sm font-medium text-slate-800">{member.activityCount}</div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assigned Owner</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {COMMUNITY_OWNERS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 font-medium">Space Focus</label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                    {member.relevantSpace}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Next Action Plan</label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">CRM Log Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="folup"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="folup" className="text-sm font-semibold text-slate-700 select-none">
                  Flag this member for immediate follow-up outreach
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleUpdateMember}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log / Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Activity Timeline</h2>
              <button
                onClick={() => setLogOpen(true)}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
              >
                <Plus size={14} /> Log Action
              </button>
            </div>

            {(!member.activities || member.activities.length === 0) ? (
              <div className="text-slate-400 text-sm text-center py-6">No community activities logged for this member.</div>
            ) : (
              <div className="relative border-l border-slate-100 pl-5 ml-2.5 space-y-5">
                {member.activities.map(act => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[27.5px] top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-100 border-2 border-indigo-600" />
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{act.space}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {act.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">{act.activityType}</div>
                    <p className="text-sm text-slate-600 mt-1">{act.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - AI Assistant & Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-indigo-400" size={20} />
              <h2 className="font-bold text-sm text-white uppercase tracking-wider">Engagement Companion</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Generate structured, rule-based recommendations to help onboard, re-engage, or spotlight this member.
            </p>

            {!aiRec ? (
              <button
                onClick={handleFetchAI}
                disabled={loadingAI}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                {loadingAI ? 'Calculating...' : 'Generate Recommendation'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">AI Summary</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiRec.activitySummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target Space</div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">{aiRec.suggestedSpace}</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Proposed Outreach</div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">{member.activityState} outreach</div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Recommended Action</div>
                  <p className="text-xs text-indigo-300 font-medium mt-1 leading-relaxed">{aiRec.suggestedNextAction}</p>
                </div>

                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Logic & Reasoning</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiRec.reasoning}</p>
                </div>

                {/* Safeguard disclaimer */}
                <div className="bg-amber-950/40 text-amber-500 border border-amber-900/50 p-3 rounded-lg flex items-start gap-2">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <div className="text-[10px] leading-relaxed">
                    <strong>Human Review Required:</strong> Review recommendation details before outreach. No messages will be sent automatically.
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAcceptAI}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle size={15} /> Apply Action
                  </button>
                  <button
                    onClick={() => setAiRec(null)}
                    className="px-3 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-lg text-sm transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Activity Modal */}
      {logOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Log Member Action</h3>
              <button onClick={() => setLogOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleLogActivity} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">FoF Space Segment</label>
                  <select
                    value={actSpace}
                    onChange={(e) => setActSpace(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    {ALL_FOF_SPACES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 font-medium">Action Type</label>
                  <select
                    value={actType}
                    onChange={(e) => setActType(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    {ACTIVITY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 font-medium">Activity Date</label>
                <input
                  type="date"
                  value={actDate}
                  onChange={(e) => setActDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Brief Description</label>
                <textarea
                  required
                  placeholder="e.g. Shared dynamic cash flow calculator template in Templates segment..."
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLogOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
