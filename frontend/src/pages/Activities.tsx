import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { Activity, ALL_FOF_SPACES, ACTIVITY_TYPES } from '../types';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [spaceFilter, setSpaceFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchActivities = () => {
    setLoading(true);
    api.getActivities()
      .then(res => setActivities(res as any))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(act => {
    if (spaceFilter !== 'All' && act.space !== spaceFilter) return false;
    if (typeFilter !== 'All' && act.activityType !== typeFilter) return false;
    if (search && !act.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout
      title="Community Activities"
      subtitle="Real-time timeline of Friends of Finance community actions"
    >
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search activity description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={spaceFilter}
              onChange={(e) => setSpaceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Spaces</option>
              {ALL_FOF_SPACES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Action Types</option>
              {ACTIVITY_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No activity matches the current filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredActivities.map((act) => (
              <div key={act.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{act.space}</span>
                    <span>{act.date}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mb-0.5">
                    {act.activityType}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">{act.description}</p>
                  <Link
                    to={`/members/${act.memberId}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View Member Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
