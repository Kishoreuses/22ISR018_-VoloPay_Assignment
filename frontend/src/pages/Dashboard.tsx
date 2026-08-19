import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, AlertTriangle, UserPlus, TrendingUp, Zap, Moon, UserCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { DashboardStats, Member } from '../types';

interface StatCardProps { title: string; value: number; icon: React.ElementType; color: string; bgColor: string; }
function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{title}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboard(),
      api.getMembers()
    ]).then(([s, members]) => {
      setStats(s as any);
      setRecentMembers((members as Member[]).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout title="Dashboard" subtitle="Loading...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    </Layout>
  );

  const s = stats!;
  return (
    <Layout title="Dashboard" subtitle="Friends of Finance Community — Activity Overview">
      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Members" value={s.totalMembers} icon={Users} color="text-slate-600" bgColor="bg-slate-100" />
        <StatCard title="Total Activities" value={s.totalActivitiesCount} icon={Activity} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard title="Follow-ups Required" value={s.followUpsRequiredCount} icon={UserCheck} color="text-orange-600" bgColor="bg-orange-50" />
        <StatCard title="Newly Joined" value={s.newlyJoinedCount} icon={UserPlus} color="text-blue-600" bgColor="bg-blue-50" />
      </div>

      {/* State breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Highly Active" value={s.highlyActiveCount} icon={Zap} color="text-purple-600" bgColor="bg-purple-50" />
        <StatCard title="Active" value={s.activeCount} icon={TrendingUp} color="text-green-600" bgColor="bg-green-50" />
        <StatCard title="At Risk" value={s.atRiskCount} icon={AlertTriangle} color="text-yellow-600" bgColor="bg-yellow-50" />
        <StatCard title="Dormant" value={s.dormantCount} icon={Moon} color="text-red-600" bgColor="bg-red-50" />
      </div>

      {/* Quick links + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Quick Access</h2>
          <div className="space-y-2">
            {[
              { to: '/members', label: 'View All Members', desc: `${s.totalMembers} members` },
              { to: '/follow-ups', label: 'Priority Follow-ups', desc: `${s.followUpsRequiredCount} pending` },
              { to: '/focused', label: 'Focused Cohorts', desc: 'At Risk & Dormant' },
              { to: '/ai-assistant', label: 'AI Assistant', desc: 'Engagement recommendations' },
            ].map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{item.label}</span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent members */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Recent Members</h2>
            <Link to="/members" className="text-xs text-indigo-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentMembers.map(m => (
              <Link key={m.id} to={`/members/${m.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
                  {m.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{m.fullName}</div>
                  <div className="text-xs text-slate-500 truncate">{m.jobRole} · {m.company}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  m.activityState === 'Newly Joined' ? 'bg-blue-100 text-blue-700' :
                  m.activityState === 'Active' ? 'bg-green-100 text-green-700' :
                  m.activityState === 'Highly Active' ? 'bg-purple-100 text-purple-700' :
                  m.activityState === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{m.activityState}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
