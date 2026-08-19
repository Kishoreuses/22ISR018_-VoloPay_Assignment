import { Member, Activity } from './types';
import { calculateMemberState } from './activityEngine';

export const INITIAL_ACTIVITIES: Activity[] = [
  // Sophia Vance (mem_1) - Newly Joined
  { id: 'act_101', memberId: 'mem_1', date: '2026-08-17', space: 'Say Hello', activityType: 'Introduction', description: 'Posted self-introduction in Say Hello, detailing 5 years of FP&A experience in manufacturing.' },
  // Marcus Chen (mem_2) - Newly Joined
  { id: 'act_201', memberId: 'mem_2', date: '2026-08-17', space: 'Say Hello', activityType: 'Introduction', description: 'Introduced himself in Say Hello and mentioned moving from public accounting to Series B controller role.' },
  // Elena Rostova (mem_3) - Highly Active
  { id: 'act_301', memberId: 'mem_3', date: '2026-08-18', space: 'Finance Workflows', activityType: 'Post', description: 'Shared a detailed 5-step month-end AP closing workflow and reconciliation checklist.' },
  { id: 'act_302', memberId: 'mem_3', date: '2026-08-15', space: 'Tools & Systems', activityType: 'Comment', description: 'Commented on ERP migration challenges between NetSuite and QuickBooks Enterprise.' },
  { id: 'act_303', memberId: 'mem_3', date: '2026-08-10', space: 'Ask Finance Peers', activityType: 'Comment', description: 'Answered a peer question regarding accrued liability estimation for logistics contracts.' },
  { id: 'act_304', memberId: 'mem_3', date: '2026-08-04', space: 'Finance Workflows', activityType: 'Comment', description: 'Provided advice on automating PO matching using OCR software.' },
  { id: 'act_305', memberId: 'mem_3', date: '2026-07-28', space: 'Templates & Resources', activityType: 'Template Share', description: 'Uploaded an Excel template for vendor payment schedule tracking.' },
  // Devon Miller (mem_4) - Highly Active
  { id: 'act_401', memberId: 'mem_4', date: '2026-08-16', space: 'Tools & Systems', activityType: 'Post', description: 'Posted a comparison framework between Kyriba and HighRadius for corporate treasury management.' },
  { id: 'act_402', memberId: 'mem_4', date: '2026-08-12', space: 'Ask Finance Peers', activityType: 'Comment', description: 'Replied to a question about managing multi-currency bank accounts in EMEA.' },
  { id: 'act_403', memberId: 'mem_4', date: '2026-08-05', space: 'Tools & Systems', activityType: 'Comment', description: 'Shared API setup experience connecting bank feed data to Snowflake.' },
  { id: 'act_404', memberId: 'mem_4', date: '2026-07-26', space: 'Ask Finance Peers', activityType: 'Post', description: 'Asked for peer feedback on automated cash forecasting accuracy metrics.' },
  // Priya Sharma (mem_5) - Highly Active
  { id: 'act_501', memberId: 'mem_5', date: '2026-08-17', space: 'Career & Compensation', activityType: 'Post', description: 'Initiated a discussion on standard equity compensation split for VP of Finance roles in retail.' },
  { id: 'act_502', memberId: 'mem_5', date: '2026-08-14', space: 'Water Cooler', activityType: 'Post', description: 'Shared a lighthearted story about surviving annual budget review season with executive leadership.' },
  { id: 'act_503', memberId: 'mem_5', date: '2026-08-09', space: 'Finance Workflows', activityType: 'Comment', description: 'Advised on setting up quarterly forecast cadence with regional store operators.' },
  { id: 'act_504', memberId: 'mem_5', date: '2026-08-02', space: 'Curated Jobs', activityType: 'Post', description: 'Posted a hiring announcement for a Senior FP&A Analyst on her team.' },
  { id: 'act_505', memberId: 'mem_5', date: '2026-07-29', space: 'Career & Compensation', activityType: 'Comment', description: 'Replied with advice on transitioning from Controller to Finance Director.' },
  // Liam O'Connor (mem_6) - Active
  { id: 'act_601', memberId: 'mem_6', date: '2026-08-11', space: 'Tools & Systems', activityType: 'Post', description: 'Asked the community for experiences with Ramp corporate card controls for remote teams.' },
  { id: 'act_602', memberId: 'mem_6', date: '2026-08-01', space: 'Tools & Systems', activityType: 'Comment', description: 'Commented on bill payment authorization matrix best practices.' },
  // Amara Okafor (mem_7) - Active
  { id: 'act_701', memberId: 'mem_7', date: '2026-08-13', space: 'Ask Finance Peers', activityType: 'Post', description: 'Asked how hardware-as-a-service finance teams amortize equipment deployment costs under GAAP.' },
  { id: 'act_702', memberId: 'mem_7', date: '2026-08-06', space: 'Finance Workflows', activityType: 'Comment', description: 'Commented on building dynamic financial models in Pigment vs Excel.' },
  { id: 'act_703', memberId: 'mem_7', date: '2026-07-27', space: 'Ask Finance Peers', activityType: 'Comment', description: 'Shared feedback on calculating gross margin for hybrid hardware/software contracts.' },
  // David Sterling (mem_8) - Active
  { id: 'act_801', memberId: 'mem_8', date: '2026-08-15', space: 'Tools & Systems', activityType: 'Comment', description: 'Provided detailed SQL script snippet for extracting NetSuite general ledger data.' },
  { id: 'act_802', memberId: 'mem_8', date: '2026-07-31', space: 'Tools & Systems', activityType: 'Post', description: 'Posted a guide on setting up automated financial dashboard alerts in Tableau.' },
  // Chloe Bennett (mem_9) - At Risk
  { id: 'act_901', memberId: 'mem_9', date: '2026-07-28', space: 'Finance Workflows', activityType: 'Comment', description: 'Commented on reducing credit hold approval bottlenecks in B2B receivables.' },
  { id: 'act_902', memberId: 'mem_9', date: '2026-06-15', space: 'Templates & Resources', activityType: 'Resource Download', description: 'Downloaded the Accounts Receivable Aging Analysis Excel Template.' },
  // Tariq Mansour (mem_10) - At Risk
  { id: 'act_1001', memberId: 'mem_10', date: '2026-07-24', space: 'Ask Finance Peers', activityType: 'Post', description: 'Asked peer feedback on handling multi-year software contract revenue recognition under ASC 606.' },
  { id: 'act_1002', memberId: 'mem_10', date: '2026-05-10', space: 'Say Hello', activityType: 'Introduction', description: 'Introduced himself in Say Hello.' },
  // Hannah Abbott (mem_11) - At Risk
  { id: 'act_1101', memberId: 'mem_11', date: '2026-07-30', space: 'Templates & Resources', activityType: 'Resource Download', description: 'Downloaded monthly financial reporting package template.' },
  { id: 'act_1102', memberId: 'mem_11', date: '2026-06-20', space: 'Ask Finance Peers', activityType: 'Comment', description: 'Commented on energy industry inventory valuation practices.' },
  // Carlos Fernandez (mem_12) - Dormant
  { id: 'act_1201', memberId: 'mem_12', date: '2026-07-05', space: 'Career & Compensation', activityType: 'Comment', description: 'Commented on biotech CFO compensation benchmarks and stock option vesting.' },
  { id: 'act_1202', memberId: 'mem_12', date: '2026-03-15', space: 'Interviews & Stories', activityType: 'Post', description: 'Shared lessons learned from raising Series B funding in healthcare.' },
  // Maya Lin (mem_13) - Dormant
  { id: 'act_1301', memberId: 'mem_13', date: '2026-06-18', space: 'Interviews & Stories', activityType: 'Comment', description: 'Commented on fintech acquisition deal structuring case study.' },
  // Nadia Patel (mem_15) - Active
  { id: 'act_1501', memberId: 'mem_15', date: '2026-08-12', space: 'Finance Workflows', activityType: 'Post', description: 'Posted a guide on conducting zero-based budgeting for operational expenses.' },
  { id: 'act_1502', memberId: 'mem_15', date: '2026-07-25', space: 'Finance Workflows', activityType: 'Comment', description: 'Commented on variance analysis threshold setting for department budget owners.' },
  // Julian Thorne (mem_16) - Newly Joined
  { id: 'act_1601', memberId: 'mem_16', date: '2026-08-18', space: 'Say Hello', activityType: 'Introduction', description: 'Posted introduction in Say Hello asking for recommended financial modeling courses.' }
];

const RAW_MEMBERS = [
  { id: 'mem_1', fullName: 'Sophia Vance', jobRole: 'FP&A Manager', company: 'Apex Dynamics', joinDate: '2026-08-17', relevantSpace: 'Finance Workflows' as const, owner: 'Kishore (Community Lead)', nextAction: 'Send welcome message & invite to intro in Say Hello', followUpRequired: true, notes: 'Joined via invitation link. Interested in rolling forecast automation in NetSuite.' },
  { id: 'mem_2', fullName: 'Marcus Chen', jobRole: 'Controller', company: 'Solaris Health', joinDate: '2026-08-16', relevantSpace: 'Ask Finance Peers' as const, owner: 'Sarah Jenkins (Member Success)', nextAction: 'Recommend ASC 842 lease accounting template from Resources', followUpRequired: true, notes: 'Ex-Big 4 CPA moving to Series B healthcare startup. Wants advice on audit readiness.' },
  { id: 'mem_3', fullName: 'Elena Rostova', jobRole: 'Finance Operations Lead', company: 'Vanguard Logistics', joinDate: '2026-05-10', relevantSpace: 'Finance Workflows' as const, owner: 'Alex Rivera (Growth Lead)', nextAction: 'Invite to present standard month-end closing checklist in next FoF webinar', followUpRequired: false, notes: 'Power contributor in Finance Workflows. Shared an AP automation comparison framework.' },
  { id: 'mem_4', fullName: 'Devon Miller', jobRole: 'Treasury Analyst', company: 'Luminary Tech', joinDate: '2026-04-15', relevantSpace: 'Tools & Systems' as const, owner: 'Kishore (Community Lead)', nextAction: 'Ask for feedback on newly posted FX hedging model in Templates & Resources', followUpRequired: false, notes: 'Active in currency risk discussions and automated cash sweep workflows.' },
  { id: 'mem_5', fullName: 'Priya Sharma', jobRole: 'Finance Director', company: 'BlueSky Retail', joinDate: '2026-03-01', relevantSpace: 'Career & Compensation' as const, owner: 'Sarah Jenkins (Member Success)', nextAction: 'Connect with junior FP&A analysts seeking career mentorship', followUpRequired: false, notes: 'Seasoned retail finance leader. Frequently replies in Career & Compensation and Water Cooler.' },
  { id: 'mem_6', fullName: "Liam O'Connor", jobRole: 'AP Manager', company: 'Veritas Capital', joinDate: '2026-06-20', relevantSpace: 'Tools & Systems' as const, owner: 'Alex Rivera (Growth Lead)', nextAction: 'Check in on Tipalti vs Ramp discussion thread response', followUpRequired: false, notes: 'Focused on vendor payment automation and card reconciliation systems.' },
  { id: 'mem_7', fullName: 'Amara Okafor', jobRole: 'Strategic Finance Lead', company: 'Aether Robotics', joinDate: '2026-06-01', relevantSpace: 'Ask Finance Peers' as const, owner: 'Kishore (Community Lead)', nextAction: 'Share SaaS unit economics benchmark calculator link', followUpRequired: false, notes: 'Building CAC/LTV reporting models for hardware-plus-software revenue model.' },
  { id: 'mem_8', fullName: 'David Sterling', jobRole: 'Finance Systems Manager', company: 'Horizon Media', joinDate: '2026-02-14', relevantSpace: 'Tools & Systems' as const, owner: 'Sarah Jenkins (Member Success)', nextAction: 'Tag in thread regarding Workday adaptive planning integration', followUpRequired: false, notes: 'Expert in ERP migrations, SQL data warehouse connections, and Tableau reporting.' },
  { id: 'mem_9', fullName: 'Chloe Bennett', jobRole: 'AR Manager', company: 'OmniCorp Global', joinDate: '2026-05-18', relevantSpace: 'Finance Workflows' as const, owner: 'Kishore (Community Lead)', nextAction: 'Send friendly DM with link to collections policy template', followUpRequired: true, notes: 'Contributed heavily to DSO reduction discussions in June but participation dropped recently.' },
  { id: 'mem_10', fullName: 'Tariq Mansour', jobRole: 'Accounting Manager', company: 'Pinnacle Cloud', joinDate: '2026-04-02', relevantSpace: 'Ask Finance Peers' as const, owner: 'Alex Rivera (Growth Lead)', nextAction: 'Re-engage via tagged question in Revenue Recognition ASC 606 space', followUpRequired: true, notes: 'Asked about deferred revenue recognition schedules. Needs follow-up nudge.' },
  { id: 'mem_11', fullName: 'Hannah Abbott', jobRole: 'Senior Accountant', company: 'Summit Energy', joinDate: '2026-01-20', relevantSpace: 'Templates & Resources' as const, owner: 'Sarah Jenkins (Member Success)', nextAction: 'Share updated monthly balance sheet reconciliation template', followUpRequired: true, notes: 'Used to download templates weekly. Inactive for 3 weeks.' },
  { id: 'mem_12', fullName: 'Carlos Fernandez', jobRole: 'VP of Finance', company: 'Zenith Bio', joinDate: '2026-03-12', relevantSpace: 'Career & Compensation' as const, owner: 'Kishore (Community Lead)', nextAction: 'Send re-engagement email regarding executive finance compensation benchmark report', followUpRequired: true, notes: 'Dormant for over 6 weeks. Previously shared equity compensation structures.' },
  { id: 'mem_13', fullName: 'Maya Lin', jobRole: 'Corporate Development Analyst', company: 'Quantum Pay', joinDate: '2026-02-01', relevantSpace: 'Interviews & Stories' as const, owner: 'Alex Rivera (Growth Lead)', nextAction: 'Invite to share M&A valuation lessons learned in Water Cooler', followUpRequired: true, notes: 'Has not logged in or posted since mid-June.' },
  { id: 'mem_14', fullName: 'Ethan Wright', jobRole: 'Head of Revenue Ops', company: 'Pulse Analytics', joinDate: '2026-05-01', relevantSpace: 'Ask Finance Peers' as const, owner: 'Sarah Jenkins (Member Success)', nextAction: 'Send 1:1 onboarding check-in and guide to Start Here', followUpRequired: true, notes: 'Created profile 3 months ago but never posted or commented.' },
  { id: 'mem_15', fullName: 'Nadia Patel', jobRole: 'Finance Manager', company: 'Starlight Systems', joinDate: '2026-07-01', relevantSpace: 'Finance Workflows' as const, owner: 'Kishore (Community Lead)', nextAction: 'Invite to join upcoming FP&A workflow discussion group', followUpRequired: false, notes: 'Shares practical tips on variance analysis and budget vs actual reporting.' },
  { id: 'mem_16', fullName: 'Julian Thorne', jobRole: 'FP&A Analyst', company: 'Nexus Supply', joinDate: '2026-08-18', relevantSpace: 'Say Hello' as const, owner: 'Unassigned', nextAction: 'Assign owner and send welcome pack in FoF Support', followUpRequired: true, notes: 'Newly registered member. Posted introduction yesterday.' }
];

export function getSeededMembers(): Member[] {
  return RAW_MEMBERS.map(raw => {
    const acts = INITIAL_ACTIVITIES.filter(a => a.memberId === raw.id);
    const calc = calculateMemberState(raw.joinDate, acts);
    return { ...raw, ...calc };
  });
}

export const SEED_INVITEES = [
  {
    id: 'inv_1',
    fullName: 'Carl Seidman, CSP, CPA',
    jobRole: 'Founder',
    company: 'Seidman Financial',
    publicSignal: 'Active LinkedIn creator posting on FP&A modeling, cash flow forecasting, and career development.',
    valueProposition: 'Access to structured Career & Compensation and Tools & Systems spaces to reach FP&A practitioners.',
    contribution: '20+ years FP&A advisory across Fortune 500; deep knowledge of modeling and forecasting.',
    relevantSpace: 'Tools & Systems / Career & Compensation',
    source: 'linkedin.com/in/carlseidman; seidmanfinancial.com/about',
    scores: { relevance: 5, contribution: 5, value: 4, evidence: 5, total: 19 },
    outreachStatus: 'Not Started',
    isPriority: false
  },
  {
    id: 'inv_2',
    fullName: 'Edwine Alphonse, CPA',
    jobRole: 'Founder',
    company: 'Your Startup CPA & James Accounting',
    publicSignal: 'Writes "The Balanced Sheets" LinkedIn newsletter; built Ramp\'s accounting function from scratch.',
    valueProposition: 'Natural extension of her newsletter in Finance Workflows and Ask Finance Peers spaces.',
    contribution: 'Scaling accounting through 4000% growth at Ramp; controller-level view on audits and close.',
    relevantSpace: 'Finance Workflows / Ask Finance Peers',
    source: 'ramp.com/authors/edwine-alphonse; thebalancedsheets.com',
    scores: { relevance: 5, contribution: 5, value: 5, evidence: 5, total: 20 },
    outreachStatus: 'Not Started',
    isPriority: true
  },
  {
    id: 'inv_3',
    fullName: 'James Kelly',
    jobRole: 'Group Treasurer',
    company: 'Pearson',
    publicSignal: 'Publicly interviewed on centralizing global cash forecasting during process overhaul.',
    valueProposition: 'Fills a thin treasury-specialist representation in the community, providing outsized visibility.',
    contribution: 'Practical large-company treasury and forecasting experience across global divisions.',
    relevantSpace: 'Tools & Systems / Finance Workflows',
    source: 'tispayments.com',
    scores: { relevance: 4, contribution: 4, value: 4, evidence: 4, total: 16 },
    outreachStatus: 'Not Started',
    isPriority: false
  },
  {
    id: 'inv_4',
    fullName: 'Claudio Antonini',
    jobRole: 'Founder & Finance Career Coach',
    company: 'The Finance Career Coach',
    publicSignal: 'Documented success stories and dedicated practice coaching exclusively finance/banking professionals.',
    valueProposition: 'Career & Compensation space serves as a ready-made channel to reach clients thinking of next career moves.',
    contribution: 'Expertise in CV positioning, salary negotiation, and finance career transitions.',
    relevantSpace: 'Career & Compensation',
    source: 'claudioantonini.me',
    scores: { relevance: 4, contribution: 3, value: 4, evidence: 4, total: 15 },
    outreachStatus: 'Not Started',
    isPriority: false
  },
  {
    id: 'inv_5',
    fullName: 'Devshi Kashyap, CA',
    jobRole: 'Head of Finance',
    company: 'HyperVerge',
    publicSignal: 'Documented building HyperVerge\'s finance function from zero including ESOP and investor reporting.',
    valueProposition: 'Bridges early-stage solo finance isolation with input from peers who scaled growth.',
    contribution: 'Early-stage SaaS finance builder view: tax, treasury, relations, and people strategy.',
    relevantSpace: 'Finance Workflows / Tools & Systems',
    source: 'linkedin.com/in/devshi-kashyap-68493786; theorg.com/org/hyperverge',
    scores: { relevance: 4, contribution: 4, value: 5, evidence: 5, total: 18 },
    outreachStatus: 'Not Started',
    isPriority: false
  },
  {
    id: 'inv_6',
    fullName: 'Paul Barnhurst',
    jobRole: 'Founder ("The FP&A Guy")',
    company: 'Seidman Financial / The FP&A Guy',
    publicSignal: 'Host of FP&A Today & Future Finance podcasts; Microsoft Excel MVP.',
    valueProposition: 'Plausible channel for guest sourcing and cross-promotions matching peer-shared values.',
    contribution: 'Broad, current view of FP&A tools and practitioner landscape from interviewing leaders.',
    relevantSpace: 'Ask Finance Peers / Interviews & Stories',
    source: 'thefpandaguy.com/about; linkedin.com/in/thefpandaguy',
    scores: { relevance: 5, contribution: 5, value: 3, evidence: 5, total: 18 },
    outreachStatus: 'Not Started',
    isPriority: false
  },
  {
    id: 'inv_7',
    fullName: 'Cynthia Brown',
    jobRole: 'Accounts Payable Consultant',
    company: 'ZRG Partners',
    publicSignal: 'Verifiable LinkedIn profile documenting global AP automation and regional AP leadership.',
    valueProposition: 'Direct match for AP automation expertise across NetSuite, SAP, and Oracle ERP platforms.',
    contribution: 'Deep, hands-on AP automation and multi-currency process experience across subsidiaries.',
    relevantSpace: 'Tools & Systems',
    source: 'linkedin.com/in/cynthia-brown-1371081b',
    scores: { relevance: 4, contribution: 4, value: 4, evidence: 4, total: 16 },
    outreachStatus: 'Not Started',
    isPriority: false
  }
];

