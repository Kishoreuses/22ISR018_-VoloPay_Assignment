import { ActivityState } from '../types';

interface Props { state: ActivityState; size?: 'sm' | 'md'; }

const STATE_STYLES: Record<ActivityState, string> = {
  'Newly Joined': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Active': 'bg-green-100 text-green-800 border border-green-200',
  'Highly Active': 'bg-purple-100 text-purple-800 border border-purple-200',
  'At Risk': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'Dormant': 'bg-red-100 text-red-800 border border-red-200'
};

export default function StateBadge({ state, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${STATE_STYLES[state]}`}>
      {state}
    </span>
  );
}
