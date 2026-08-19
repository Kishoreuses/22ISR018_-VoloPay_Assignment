import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Outreach from './pages/Outreach';
import MemberDetail from './pages/MemberDetail';
import Activities from './pages/Activities';
import FollowUps from './pages/FollowUps';
import Focused from './pages/Focused';
import AIAssistant from './pages/AIAssistant';
import Help from './pages/Help';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/outreach" element={<Outreach />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/follow-ups" element={<FollowUps />} />
          <Route path="/focused" element={<Focused />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
