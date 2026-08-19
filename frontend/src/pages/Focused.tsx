import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Moon, RefreshCw, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { Member } from '../types';

export default function Focused() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = () => {
    setLoading(true);
    api.getMembers()
      .then(res => setMembers(res as any))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const atRisk = members.filter(m => m.activityState === 'At Risk');
  const dormant = members.filter(m => m.activityState === 'Dormant');

  return (
    <Layout
      title="Retention Cohorts"
      subtitle="Proactive community outreach groups focusing on At Risk and Dormant segments"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At Risk Segment */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={20} />
            <div>
              <h2 className="font-bold text-slate-800 text-sm">At Risk Segment ({atRisk.length})</h2>
              <p className="text-xs text-slate-500">No activity logged for approximately 15–30 days</p>
            </div>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-auto max-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600" />
              </div>
            ) : atRisk.length === 0 ? (
              <div className="text-slate-400 text-center py-12 text-sm">No members are currently at risk.</div>
            ) : (
              atRisk.map(m => (
                <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <Link to={`/members/${m.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                      {m.fullName}
                    </Link>
                    <div className="text-xs text-slate-500">{m.jobRole} at {m.company}</div>
                    <div className="text-xs text-amber-600 font-semibold mt-1">Last Active: {m.lastActivityDate}</div>
                  </div>
                  <Link to={`/members/${m.id}`} className="text-slate-400 hover:text-slate-600">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dormant Segment */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-rose-50 border-b border-rose-100 px-6 py-4 flex items-center gap-2">
            <Moon className="text-rose-600" size={20} />
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Dormant Segment ({dormant.length})</h2>
              <p className="text-xs text-slate-500">No community activity for more than 30 days</p>
            </div>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-auto max-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600" />
              </div>
            ) : dormant.length === 0 ? (
              <div className="text-slate-400 text-center py-12 text-sm">No dormant members.</div>
            ) : (
              dormant.map(m => (
                <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <Link to={`/members/${m.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                      {m.fullName}
                    </Link>
                    <div className="text-xs text-slate-500">{m.jobRole} at {m.company}</div>
                    <div className="text-xs text-rose-600 font-semibold mt-1">Last Active: {m.lastActivityDate}</div>
                  </div>
                  <Link to={`/members/${m.id}`} className="text-slate-400 hover:text-slate-600">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
