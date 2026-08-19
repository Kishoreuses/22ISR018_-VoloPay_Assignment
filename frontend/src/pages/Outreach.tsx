import { useEffect, useState } from 'react';
import { Sparkles, Users, Award, ShieldAlert, CheckCircle2, ChevronRight, HelpCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { Invitee } from '../types';

const TOUCH_STEPS = [
  {
    step: 1,
    title: 'Touch 1: Connection Request',
    channel: 'LinkedIn (Connection Request Note)',
    message: "Hi Edwine. I've been reading The Balanced Sheets, especially the piece on building Ramp's accounting function from scratch. I'm involved with Friends of Finance, a peer community where finance people trade real, unpolished experience. Would love to connect.",
    purpose: 'Get connection accepted based on a specific, genuine reference to her work.',
    intendedAction: 'Accept connection request.'
  },
  {
    step: 2,
    title: 'Touch 2: Acceptance Follow-Up',
    channel: 'LinkedIn Direct Message',
    message: "Thanks for connecting! Your point about accounting being something you learn by doing, not just from a textbook, is basically the whole premise Friends of Finance is built on — people posting real month-end headaches and close-process fixes instead of polished case studies. Out of curiosity, is close-process documentation something you still think about often, or is that mostly behind you now that you're on the advisory side?",
    purpose: 'Build rapport and verify shared values; start peer conversation without pitching.',
    intendedAction: 'Reply to question, continuing the conversation as a peer.'
  },
  {
    step: 3,
    title: 'Touch 3: Invitation Email',
    channel: 'Email (Contact Form / Direct Address)',
    message: "Subject: A community built around exactly what you already write about\n\nHi Edwine,\nFollowing up from LinkedIn — i wanted to properly introduce Friends of Finance. It's a community and learning hub for finance professionals built around one idea: real finance work, shared openly, not theory or polished case studies. There's an \"Ask Finance Peers\" space for judgment-call questions, a \"Finance Workflows\" space for how processes actually get done, and \"Interviews & Stories,\" a Faces of Finance series profiling members' career journeys — which honestly reads like a natural extension of The Balanced Sheets.\n\nNo cost, no sales pitch inside the space itself. If you'd like, I can send you a direct link to look around before deciding anything.\n\nBest, Kishore S",
    purpose: 'Deliver a structured, low-friction invitation once initial rapport is established.',
    intendedAction: 'Reply with interest or ask clarifying questions.'
  },
  {
    step: 4,
    title: 'Touch 4: Value-Led Touch',
    channel: 'LinkedIn Message or Email',
    message: "No pressure on the community, by the way — i saw a thread in Finance Workflows this week from a controller describing almost the exact three-way-matching mess you've written about, and it made me think of your piece again. Sharing in case it's useful either way: [Friends of Finance]. If you ever wanted to do a Faces of Finance interview independent of joining anything, that'd be a great fit for that space too.",
    purpose: 'Provide immediate value with no ask, offering a guest interview as an alternative.',
    intendedAction: 'Engage with shared content or express interest in the interview.'
  },
  {
    step: 5,
    title: 'Touch 5: Respectful Close-the-Loop',
    channel: 'LinkedIn Message or Email',
    message: "Wanted to close the loop and say no worries either way. I know you've got a lot going with the newsletter, coaching, and the firms. The invite (and the interview offer) stands whenever it's useful, with zero expiry. Really enjoyed the exchange regardless — thanks for taking the time.",
    purpose: 'End sequence on goodwill, remove pressure, and close out respectful follow-up.',
    intendedAction: 'No action required; door remains open for self-initiated engagement.'
  }
];

const SITUATION_RESPONSES = [
  {
    id: 'sit_a',
    title: 'Situation A: "I do not want to join another promotional group."',
    reply: "Totally fair, and I get why that's the default assumption. Friends of Finance isn't a lead list or a content funnel — it's mostly finance people posting real month-end and process headaches, moderated space by space so it stays useful instead of noisy. I only reached out because your writing on the Ramp build-out is exactly the kind of thing that space is built around. No pressure at all if it's still not for you — happy to leave it here."
  },
  {
    id: 'sit_b',
    title: 'Situation B: "Is this a Volopay sales community?"',
    reply: "Good question, and I'd rather be straightforward than dodge it: Friends of Finance is a community initiative connected to Volopay, but it isn't a sales funnel — you won't get pitched Volopay's product inside the space, and members join for the peer content (Ask Finance Peers, Finance Workflows, etc.), not because of the company behind it. If that connection still doesn't sit right for you, that's a completely reasonable line to draw, and I won't push it further."
  },
  {
    id: 'sit_c',
    title: 'Situation C: No response after the complete 5-touch sequence',
    reply: "Plan: Pause — do not message further. Continuing to message someone who hasn't responded across 5 genuine, well-spaced touches crosses into pressure. We will only re-engage if a future signal occurs (e.g. she writes a new Balanced Sheets post about peer learning, or likes/shares Friends of Finance content)."
  }
];

export default function Outreach() {
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'candidates' | 'priority-journey'>('candidates');
  
  // Priority Journey State
  const [priorityInvitee, setPriorityInvitee] = useState<Invitee | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);

  const fetchInvitees = () => {
    setLoading(true);
    api.getInvitees()
      .then(res => {
        const list = res as Invitee[];
        setInvitees(list);
        const priority = list.find(i => i.isPriority);
        if (priority) {
          setPriorityInvitee(priority);
          // Set step index based on status
          if (priority.outreachStatus === 'Touch 1 Sent') setCurrentStepIndex(1);
          else if (priority.outreachStatus === 'Touch 2 Sent') setCurrentStepIndex(2);
          else if (priority.outreachStatus === 'Touch 3 Sent') setCurrentStepIndex(3);
          else if (priority.outreachStatus === 'Touch 4 Sent') setCurrentStepIndex(4);
          else if (priority.outreachStatus === 'Touch 5 Sent') setCurrentStepIndex(5);
          else setCurrentStepIndex(0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvitees();
  }, []);

  const handleUpdateStatus = (status: string) => {
    if (!priorityInvitee) return;
    api.updateInviteeStatus(priorityInvitee.id, status)
      .then(() => fetchInvitees());
  };

  const handleAdvanceStep = () => {
    const nextStep = currentStepIndex + 1;
    if (nextStep <= 5) {
      const status = `Touch ${nextStep} Sent`;
      handleUpdateStatus(status);
    }
  };

  const handleResetJourney = () => {
    handleUpdateStatus('Not Started');
    setSelectedSituation(null);
  };

  return (
    <Layout
      title="Outreach Sourcing & Journey Planner"
      subtitle="Candidates sourced in Task 1 and the invitation journey designed in Task 2"
    >
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'candidates'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={16} /> Sourced Candidates (Task 1)
          </div>
        </button>
        <button
          onClick={() => setActiveTab('priority-journey')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'priority-journey'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} /> Priority Outreach Journey (Task 2)
          </div>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : activeTab === 'candidates' ? (
        <div className="space-y-6">
          {/* Candidates Directory */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-sm">Target Invitees List ({invitees.length})</h2>
              <span className="text-xs text-slate-500 font-medium">Real Professionals Sourced for Outreach simulation</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                    <th className="px-6 py-4">Professional Detail</th>
                    <th className="px-6 py-4">Public Signal</th>
                    <th className="px-6 py-4">Community Fit & Space</th>
                    <th className="px-6 py-4">Relevance Score</th>
                    <th className="px-6 py-4">Source Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {invitees.map(inv => (
                    <tr key={inv.id} className={`hover:bg-slate-50 transition-colors ${inv.isPriority ? 'bg-indigo-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {inv.fullName}
                          {inv.isPriority && (
                            <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">Priority</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{inv.jobRole}</div>
                        <div className="text-xs font-semibold text-indigo-600">{inv.company}</div>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="text-xs text-slate-600 italic">"{inv.publicSignal}"</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{inv.relevantSpace}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{inv.valueProposition}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="font-bold text-indigo-700">{inv.scores.total}/20</div>
                        <div className="text-[10px] text-slate-400">Relevance: {inv.scores.relevance} · Contrib: {inv.scores.contribution}</div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://${inv.source.split(';')[0].trim()}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline font-semibold break-all"
                        >
                          {inv.source.split(';')[0]}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Priority Journey Interactive View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main sequence controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-bold text-slate-800 text-base">Edwine Alphonse Outreach Journey</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Step-by-step personalized outreach pipeline designed in Task 2</p>
                </div>
                <button
                  onClick={handleResetJourney}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Reset Journey
                </button>
              </div>

              {/* Steps Progress Visualizer */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-6 overflow-x-auto">
                {TOUCH_STEPS.map((t, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isCompleted = idx < currentStepIndex;
                  return (
                    <div key={t.step} className="flex items-center gap-1 shrink-0">
                      <div
                        onClick={() => { if (idx <= currentStepIndex) setCurrentStepIndex(idx); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓' : t.step}
                      </div>
                      <span className={`text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                        Touch {t.step}
                      </span>
                      {idx < 4 && <div className="w-4 h-0.5 bg-slate-200" />}
                    </div>
                  );
                })}
              </div>

              {/* Active Step Details */}
              {currentStepIndex < 5 ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold uppercase px-2 py-0.5 rounded">
                      {TOUCH_STEPS[currentStepIndex].channel}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base mt-2">
                      {TOUCH_STEPS[currentStepIndex].title}
                    </h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {TOUCH_STEPS[currentStepIndex].message}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Touch Purpose</span>
                      <p className="text-xs text-slate-600 mt-0.5">{TOUCH_STEPS[currentStepIndex].purpose}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Intended Action</span>
                      <p className="text-xs text-slate-600 mt-0.5">{TOUCH_STEPS[currentStepIndex].intendedAction}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleAdvanceStep}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                    >
                      Simulate Sending Touch {currentStepIndex + 1} <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-lg">Sequence Completed!</h3>
                  <p className="text-slate-500 text-sm mt-1">All 5 personalized touches have been successfully simulated.</p>
                </div>
              )}
            </div>

            {/* Situation Responses Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4">
                Interactive Situation Response Scenarios
              </h2>
              <div className="space-y-3">
                {SITUATION_RESPONSES.map(sit => (
                  <div key={sit.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setSelectedSituation(selectedSituation === sit.id ? null : sit.id)}
                      className="w-full px-4 py-3 bg-slate-50 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      {sit.title}
                      <span>{selectedSituation === sit.id ? 'Hide' : 'Show Reply'}</span>
                    </button>
                    {selectedSituation === sit.id && (
                      <div className="p-4 border-t border-slate-200 bg-slate-900 text-indigo-300 font-mono text-xs leading-relaxed whitespace-pre-line">
                        {sit.reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Personalization & Target details */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Award className="text-indigo-400" size={20} />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Priority Target Profile</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Priority Invitee</span>
                  <div className="font-bold text-white text-base">Edwine Alphonse, CPA</div>
                  <div className="text-xs text-slate-400">Founder, Your Startup CPA & James Accounting</div>
                  <div className="text-xs text-indigo-400 font-semibold mt-0.5">Former Senior Controller, Ramp</div>
                </div>

                <div className="bg-slate-800/80 rounded p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Why She is Selected</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Closest match to FoF's actual motto — "real finance work, shared openly." She already hosts "The Balanced Sheets" newsletter detailing audits, month-end closing, and controllership realities.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Outreach Pipeline Status</span>
                  <div className="font-semibold text-slate-200 mt-1">
                    {priorityInvitee?.outreachStatus || 'Not Started'}
                  </div>
                </div>

                {/* Human checks warning */}
                <div className="bg-amber-950/40 text-amber-500 border border-amber-900/50 p-3 rounded-lg flex items-start gap-2">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <div className="text-[10px] leading-relaxed">
                    <strong>Simulation Only:</strong> This is a simulation framework for evaluation. No emails, messages, or invites will be triggered or sent out.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
