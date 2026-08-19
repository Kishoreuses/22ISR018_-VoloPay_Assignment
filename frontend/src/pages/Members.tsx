import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import StateBadge from '../components/StateBadge';
import { api } from '../api';
import { Member, ALL_FOF_SPACES, COMMUNITY_OWNERS } from '../types';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [spaceFilter, setSpaceFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    jobRole: '',
    company: '',
    relevantSpace: 'Say Hello',
    owner: 'Unassigned',
    notes: '',
    followUpRequired: true,
    nextAction: 'Send welcome intro'
  });

  const fetchMembers = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (stateFilter !== 'All') params.state = stateFilter;
    if (spaceFilter !== 'All') params.space = spaceFilter;
    if (ownerFilter !== 'All') params.owner = ownerFilter;

    api.getMembers(params)
      .then(res => setMembers(res as any))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [search, stateFilter, spaceFilter, ownerFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.createMember(formData).then(() => {
      setModalOpen(false);
      setFormData({
        fullName: '',
        jobRole: '',
        company: '',
        relevantSpace: 'Say Hello',
        owner: 'Unassigned',
        notes: '',
        followUpRequired: true,
        nextAction: 'Send welcome intro'
      });
      fetchMembers();
    });
  };

  return (
    <Layout
      title="Members Directory"
      subtitle="View, search, and filter Friends of Finance community members"
      actions={
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Member
        </button>
      }
    >
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, company, or job role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All States</option>
              <option value="Newly Joined">Newly Joined</option>
              <option value="Active">Active</option>
              <option value="Highly Active">Highly Active</option>
              <option value="At Risk">At Risk</option>
              <option value="Dormant">Dormant</option>
            </select>
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
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 mb-2">No members found matching filters.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Company & Role</th>
                  <th className="px-6 py-4">State</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions Count</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/members/${m.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                        {m.fullName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>{m.jobRole}</div>
                      <div className="text-xs text-slate-400">{m.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StateBadge state={m.activityState} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{m.joinDate}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{m.activityCount}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/members/${m.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Add New Member</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Job Role</label>
                  <input
                    required
                    type="text"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Company</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Space Segment</label>
                  <select
                    value={formData.relevantSpace}
                    onChange={(e) => setFormData({ ...formData, relevantSpace: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ALL_FOF_SPACES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Owner</label>
                  <select
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {COMMUNITY_OWNERS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Next Outreach Action</label>
                <input
                  type="text"
                  value={formData.nextAction}
                  onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Profile Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="followUpRequired" className="text-sm font-medium text-slate-700 select-none">
                  Flag for Follow-up queue
                </label>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
