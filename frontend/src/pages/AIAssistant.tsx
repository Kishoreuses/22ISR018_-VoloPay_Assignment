import { useEffect, useState } from 'react';
import { Sparkles, ShieldAlert, ArrowRight, CheckCircle2, User } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { Member, AIRecommendationResponse } from '../types';

export default function AIAssistant() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [rec, setRec] = useState<AIRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api.getMembers().then(res => {
      const arr = res as Member[];
      setMembers(arr);
      if (arr.length > 0) setSelectedId(arr[0].id);
    });
  }, []);

  const handleGenerate = () => {
    if (!selectedId) return;
    setLoading(true);
    setRec(null);
    setSuccessMsg('');
    api.getAIRecommendation(selectedId)
      .then(res => setRec(res as AIRecommendationResponse))
      .finally(() => setLoading(false));
  };

  const handleApply = () => {
    if (!rec) return;
    setSaving(true);
    api.updateMember(rec.memberId, {
      relevantSpace: rec.suggestedSpace,
      nextAction: rec.suggestedNextAction
    }).then(() => {
      setSuccessMsg(`Successfully updated outreach action for member: ${rec.memberName}`);
      setRec(null);
    }).finally(() => setSaving(false));
  };

  const activeMember = members.find(m => m.id === selectedId);

  return (
    <Layout
      title="Engagement Assistant"
      subtitle="Fictional rules-based AI advisor to suggest outreach plans and target spaces"
    >
      <div className="max-w-3xl space-y-6">
        {/* Selector Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-indigo-600" size={20} />
            <h2 className="font-bold text-slate-800 text-sm">Select Fictional Member</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Pick a member to view their current profile state and generate simulated outreach suggestions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setRec(null);
                setSuccessMsg('');
              }}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.activityState} · {m.company})
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedId}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Analyzing...' : 'Generate Plan'}
            </button>
          </div>

          {successMsg && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
              {successMsg}
            </div>
          )}
        </div>

        {/* Advisor Output Panel */}
        {rec && activeMember && (
          <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{rec.memberName}</h3>
                <p className="text-xs text-slate-400">{activeMember.jobRole} at {activeMember.company}</p>
              </div>
              <span className="text-xs font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                {activeMember.activityState} Cohort
              </span>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Engagement Summary</div>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.activitySummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Suggested FoF space</div>
                <div className="text-sm font-bold text-slate-200">{rec.suggestedSpace}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Strategic Logic</div>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.reasoning}</p>
              </div>
            </div>

            <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-lg p-4">
              <div className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mb-1">Recommended Outreach Action</div>
              <p className="text-xs text-indigo-200 font-semibold leading-relaxed">{rec.suggestedNextAction}</p>
            </div>

            {/* Safeguard disclaimer */}
            <div className="bg-amber-950/40 text-amber-500 border border-amber-900/50 p-4 rounded-lg flex items-start gap-2.5">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong>Human Review Required:</strong> Next outreach actions must be reviewed by the community lead before messaging. This dashboard does not trigger automated external communications.
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApply}
                disabled={saving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 size={16} /> Apply Suggested Action Plan
              </button>
              <button
                onClick={() => setRec(null)}
                className="px-4 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-lg text-sm transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
