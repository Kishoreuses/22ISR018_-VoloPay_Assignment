import { Activity, ActivityState } from './types';

const REFERENCE_DATE = '2026-08-19';

export function calculateMemberState(
  joinDateStr: string,
  activities: Activity[]
): { activityState: ActivityState; lastActivityDate: string; activityCount: number } {
  const refDate = new Date(REFERENCE_DATE);
  const joinDate = new Date(joinDateStr);

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const activityCount = sortedActivities.length;
  const lastActivityDate =
    sortedActivities.length > 0 ? sortedActivities[0].date : joinDateStr;
  const lastActDateObj = new Date(lastActivityDate);

  const daysSinceJoin = Math.max(
    0,
    Math.floor((refDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const daysSinceLastActivity = Math.max(
    0,
    Math.floor((refDate.getTime() - lastActDateObj.getTime()) / (1000 * 60 * 60 * 24))
  );

  const activitiesIn30Days = sortedActivities.filter(act => {
    const diff = (refDate.getTime() - new Date(act.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  });

  const uniqueSpacesIn30Days = new Set(activitiesIn30Days.map(a => a.space)).size;

  let activityState: ActivityState = 'Active';

  if (daysSinceJoin <= 7 && activitiesIn30Days.length < 2) {
    activityState = 'Newly Joined';
  } else if (activitiesIn30Days.length >= 4 && uniqueSpacesIn30Days >= 2) {
    activityState = 'Highly Active';
  } else if (activitiesIn30Days.length >= 2) {
    activityState = 'Active';
  } else if (daysSinceLastActivity >= 15 && daysSinceLastActivity <= 30) {
    activityState = 'At Risk';
  } else if (daysSinceLastActivity > 30) {
    activityState = 'Dormant';
  } else {
    activityState = 'Active';
  }

  return { activityState, lastActivityDate, activityCount };
}
