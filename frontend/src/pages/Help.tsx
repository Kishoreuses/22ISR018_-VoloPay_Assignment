import { useState } from 'react';
import { HelpCircle, RefreshCw, Database, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../api';

export default function Help() {
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setResetting(true);
    setSuccess(false);
    api.resetSeed()
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      })
      .finally(() => setResetting(false));
  };

  return (
    <Layout
      title="Testing & Orientation Guide"
      subtitle="Complete instructions to verify Friends of Finance CRM functionality"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">10-Step Interactive Testing Protocol</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Inspect Seed State', text: 'Open the dashboard page. Observe 16 fictional members partitioned into Newly Joined, Active, Highly Active, At Risk, and Dormant states.' },
                { step: 2, title: 'Verify Retention Cohorts', text: 'Go to Focused Cohorts tab. Confirm At Risk and Dormant segments partition correctly (e.g. Chloe/Tariq/Hannah in At Risk, Carlos/Maya/Ethan in Dormant).' },
                { step: 3, title: 'Add a Fictional Member', text: 'Go to Members Directory page, click Add Member, fill the form with a fictional name, and save. Verify they appear at the top of the directory table.' },
                { step: 4, title: 'Inspect a Member Profile', text: 'Click "Manage" next to any member. View their join date, activity timeline, owner, notes, and CRM action fields.' },
                { step: 5, title: 'Log a Community Activity', text: 'Within the Member profile, click "Log Action". Log a "Comment" in the "Ask Finance Peers" space and save. Observe the timeline append.' },
                { step: 6, title: 'Observe State Re-calculation', text: 'After adding activities for a member (e.g. At Risk or Dormant), check how their State is immediately recalculated to Active / Highly Active based on the 30-day activity window rule.' },
                { step: 7, title: 'Run AI Assistant Companion', text: 'Click "Generate Recommendation" in the member profile sidebar. Verify a rule-based outreach plan matches the cohort state.' },
                { step: 8, title: 'Confirm AI Safeguards', text: 'Verify the "Human Review Required" amber alert warning is present on both the profile and the AI Assistant page.' },
                { step: 9, title: 'Verify Priority Queue', text: 'Go to the Follow-ups tab. Try re-assigning owners or editing the next action directly. Click "Resolve" to clear the member from the priority queue.' },
                { step: 10, title: 'Test Global Search & Space Filter', text: 'Go to Members and filter by a space (e.g. "Say Hello") or search by company. Ensure matching fictional profiles show up accurately.' }
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Database actions & instructions */}
        <div className="space-y-6">
          {/* Reset Seeds */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Database className="text-indigo-600" size={20} />
              <h2 className="font-bold text-slate-800 text-sm">System Database Actions</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              If your database becomes cluttered or you want to start fresh with clean, predefined fictional seed members and activities, trigger a db reset.
            </p>

            <button
              onClick={handleReset}
              disabled={resetting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors"
            >
              <RefreshCw size={14} className={resetting ? 'animate-spin' : ''} />
              {resetting ? 'Resetting Database...' : 'Reset Fictional Seeds'}
            </button>

            {success && (
              <div className="mt-3 p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={14} /> Database Reset Successful!
              </div>
            )}
          </div>

          {/* CRM Guidelines */}
          <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="text-indigo-400" size={20} />
              <h2 className="font-bold text-white text-sm">Activity CRM Principles</h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-400 list-disc pl-4">
              <li>
                <strong className="text-slate-200">Community Focus:</strong> No sales funnels, pipelines, or conversions. Metrics measure engagement spaces and cohorts.
              </li>
              <li>
                <strong className="text-slate-200">State Recalculations:</strong> Engagement states are dynamic and recalculate in real-time when new activities are logged.
              </li>
              <li>
                <strong className="text-slate-200">Privacy & Ethics:</strong> The CRM is seeded and restricted to fictional profiles only. Real financial practitioners are excluded.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
