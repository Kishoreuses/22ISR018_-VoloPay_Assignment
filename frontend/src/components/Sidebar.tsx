import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Send, Activity, UserCheck, Focus, Sparkles, HelpCircle, Building2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/members', label: 'Members', icon: Users },
  { path: '/outreach', label: 'Outreach Tracker', icon: Send },
  { path: '/activities', label: 'Activities', icon: Activity },
  { path: '/follow-ups', label: 'Follow-ups', icon: UserCheck },
  { path: '/focused', label: 'Focused Cohorts', icon: Focus },
  { path: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
  { path: '/help', label: 'Help & Guide', icon: HelpCircle }
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Friends of Finance</div>
            <div className="text-xs text-slate-400">Community CRM</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">Task 3 · Growth Squad Assignment</div>
        <div className="text-xs text-slate-600 mt-1">Friends of Finance · 2026</div>
      </div>
    </aside>
  );
}
