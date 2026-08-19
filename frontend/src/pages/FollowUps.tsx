import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, CheckCircle2, User, RefreshCw, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import StateBadge from '../components/StateBadge';
import { api } from '../api';
import { Member, COMMUNITY_OWNERS } from '../types';

export default function FollowUps() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit states mapping to active member
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionVal, setActionVal] = useState('');
  const [ownerVal, setOwnerVal] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchFollowUps = () => {
    setLoading(true);
    api.getMembers({ followUp: 'true' })
      .then(res => setMembers(res as any))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleResolve = (id: string) => {
    api.updateMember(id, { followUpRequired: false }).then(() => {
      fetchFollowUps();
    });
  };

  const handleStartEdit = (m: Member) => {
    setEditingId(m.id);
    setActionVal(m.nextAction || '');
    setOwnerVal(m.owner || 'Unassigned');
  };

  const handleSaveEdit = (id: string) => {
    setSaving(true);
    api.updateMember(id, { nextAction: actionVal, owner: ownerVal })
      .then(() => {
        setEditingId(null);
        fetchFollowUps();
      })
      .finally(() => setSaving(false));
  };

  return (
    <Layout
      title="Priority Outreach Queue"
      subtitle="Fictional members flagged for follow-ups, welcome calls, or re-engagement"
    >
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">Outreach queue clear!</h3>
            <p className="text-slate-400 text-sm mt-1">All flagged members have been followed up with.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((m) => (
              <div key={m.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Link to={`/members/${m.id}`} className="font-bold text-slate-900 hover:text-indigo-600 text-base">
                      {m.fullName}
                    </Link>
                    <StateBadge state={m.activityState} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 mb-3">{m.jobRole} · {m.company}</div>

                  {editingId === m.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Outreach Action Plan</label>
                        <input
                          type="text"
                          value={actionVal}
                          onChange={(e) => setActionVal(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assign Owner</label>
                        <select
                          value={ownerVal}
                          onChange={(e) => setOwnerVal(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none"
                        >
                          {COMMUNITY_OWNERS.map(o => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        <strong className="text-slate-700">Next Action:</strong> {m.nextAction || 'Welcome message'}
                      </div>
                      <div className="text-xs text-slate-500">
                        <strong className="text-slate-700">Owner Assigned:</strong> {m.owner || 'Unassigned'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {editingId === m.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(m.id)}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleResolve(m.id)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 size={14} /> Resolve
                      </button>
                      <button
                        onClick={() => handleStartEdit(m)}
                        className="border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                      >
                        Update
                      </button>
                      <Link
                        to={`/members/${m.id}`}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
