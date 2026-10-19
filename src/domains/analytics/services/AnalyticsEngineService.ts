import type {
  CohortAnalysis,
  FunnelData,
  UserSegment,
} from '../types/analytics';

export interface ConversionPath {
  path: string[];
  conversions: number;
  value: number;
  abandonmentRate: number;
}

export interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

export interface UserBehaviorPrediction {
  churnProbability: number;
  lifetimeValue: number;
  nextAction: string;
  confidence: number;
}

export interface UserData {
  signup_date?: string | Date;
  last_activity?: string | Date;
  last_login_days?: number;
  session_duration?: number;
  pages_per_session?: number;
  bounce_rate?: number;
  age?: number;
  location?: string;
  churned?: boolean;
  lifetime_value?: number;
  last_action?: string;
}

export interface ConversionData {
  path?: string[];
  value?: number;
}

export interface FunnelItem {
  [key: string]: boolean | number | undefined;
  time_spent?: number;
}

export interface ActivityItem {
  timestamp: string | Date;
}

type NumericUserMetric =
  | 'session_duration'
  | 'pages_per_session'
  | 'bounce_rate'
  | 'lifetime_value'
  | 'last_login_days';

const isUserMetric = (key: string): key is NumericUserMetric =>
  [
    'session_duration',
    'pages_per_session',
    'bounce_rate',
    'lifetime_value',
    'last_login_days',
  ].includes(key);

const getNumericMetric = (user: UserData, key: NumericUserMetric): number => {
  const value = user[key];
  return typeof value === 'number' ? value : 0;
};

const SEGMENT_THRESHOLDS = {
  activeDays: 7,
  moderateDays: 30,
} as const;

export class AnalyticsEngineService {
    public calculateRetention(data: UserData[]): CohortAnalysis[] {
    const cohorts: Map<string, UserData[]> = new Map();

    data.forEach((user) => {
      if (!user.signup_date) return;
      const signupMonth = new Date(user.signup_date).toISOString().slice(0, 7);
      if (!cohorts.has(signupMonth)) {
        cohorts.set(signupMonth, []);
      }
      const cohort = cohorts.get(signupMonth);
      if (cohort) {
        cohort.push(user);
      }
    });

    const cohortAnalysis: CohortAnalysis[] = [];

    cohorts.forEach((users, cohort) => {
      const retention: number[] = [];
      for (let month = 0; month < 12; month++) {
        const activeUsersCount = users.filter((user) => {
          if (!user.last_activity || !user.signup_date) return false;
          const signupDate = new Date(user.signup_date);
          const targetDate = new Date(
            signupDate.getFullYear(),
            signupDate.getMonth() + month,
            1,
          );
          return new Date(user.last_activity) >= targetDate;
        }).length;

        retention.push((activeUsersCount / users.length) * 100);
      }

      cohortAnalysis.push({
        cohort,
        size: users.length,
        retention,
        averageRetention: retention.length === 0
          ? 0
          : retention.reduce((a, b) => a + b, 0) / retention.length,
      });
    });

    return cohortAnalysis;
  }

    public analyzeConversionPaths(data: ConversionData[]): ConversionPath[] {
    const paths: Map<string, { count: number; value: number }> = new Map();
    let totalConversions = 0;

    data.forEach((conversion) => {
      if (!conversion.path) return;
      const pathKey = conversion.path.join(' → ');
      if (!paths.has(pathKey)) {
        paths.set(pathKey, { count: 0, value: 0 });
      }

      const path = paths.get(pathKey);
      if (path) {
        path.count++;
        path.value += conversion.value ?? 0;
        totalConversions++;
      }
    });

    return Array.from(paths.entries())
      .map(([pathString, path]) => ({
        path: pathString.split(' → '),
        conversions: path.count,
        value: path.value,
        abandonmentRate:
          totalConversions > 0
            ? ((totalConversions - path.count) / totalConversions) * 100
            : 0,
      }))
      .sort((a, b) => b.conversions - a.conversions);
  }

    public calculateFunnel(data: FunnelItem[], steps: string[]): FunnelData {
    let previousCount = data.length;
    const funnelSteps = steps.map((step, index) => {
      const stepCount = data.filter((item) => Boolean(item[step])).length;
      const conversionRate =
        index === 0 ? 100 : previousCount > 0 ? (stepCount / previousCount) * 100 : 0;
      previousCount = stepCount;

      const stepData = data.filter((item) => Boolean(item[step]));
      const avgTime =
        stepData.length > 0
          ? stepData.reduce((sum, item) => sum + (item.time_spent ?? 0), 0) /
            stepData.length
          : 0;

      return {
        name: step,
        count: stepCount,
        conversionRate,
        dropOffRate: 100 - conversionRate,
        averageTime: avgTime,
      };
    });

    return {
      title: 'Conversion Funnel',
      steps: funnelSteps,
      totalUsers: data.length,
      finalConversion: funnelSteps[funnelSteps.length - 1]?.conversionRate ?? 0,
    };
  }

    public generateActivityHeatmap(data: ActivityItem[]): HeatmapData[] {
    const heatmap: HeatmapData[] = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const count = data.filter((item) => {
          const d = new Date(item.timestamp);
                    const mondayFirst = (d.getDay() + 6) % 7;
          return mondayFirst === day && d.getHours() === hour;
        }).length;

        heatmap.push({ day: days[day], hour, value: count });
      }
    }
    return heatmap;
  }

    public segmentUsers(data: UserData[]): UserSegment[] {
    const defineSegment = (
      name: string,
      filter: (u: UserData) => boolean,
      chars: string[],
    ) => {
      const users = data.filter(filter);
      const safeAvg = (field: string): number => {
        if (users.length === 0) return 0;
        if (!isUserMetric(field)) return 0;
        return users.reduce((sum, user) => sum + getNumericMetric(user, field), 0) /
          users.length;
      };

      return {
        name,
        count: users.length,
        percentage: data.length === 0 ? 0 : (users.length / data.length) * 100,
        characteristics: chars,
        behavior: {
          avgSessionDuration: safeAvg('session_duration'),
          pagesPerSession: safeAvg('pages_per_session'),
          bounceRate: safeAvg('bounce_rate'),
        },
      };
    };

    return [
      defineSegment('Active', (u) => {
        const days = u.last_login_days;
        return typeof days === 'number' && days <= SEGMENT_THRESHOLDS.activeDays;
      }, ['Recent login', 'High engagement']),
      defineSegment('Moderate', (u) => {
        const days = u.last_login_days;
        return (
          typeof days === 'number' &&
          days > SEGMENT_THRESHOLDS.activeDays &&
          days <= SEGMENT_THRESHOLDS.moderateDays
        );
      }, ['Occasional login']),
      defineSegment('Inactive', (u) => {
        const days = u.last_login_days;
        return typeof days === 'number' && days > SEGMENT_THRESHOLDS.moderateDays;
      }, ['Churn risk', 'Low activity']),
    ];
  }

    public predictUserBehavior(
    user: UserData,
    historicalData: UserData[],
  ): UserBehaviorPrediction {
    const similarUsers = historicalData.filter(
      (u) =>
        Math.abs((u.age ?? 0) - (user.age ?? 0)) < 5 && u.location === user.location,
    );

    if (similarUsers.length === 0) {
      return {
        churnProbability: 0,
        lifetimeValue: 0,
        nextAction: 'none',
        confidence: 0,
      };
    }

    const churnCount = similarUsers.filter((u) => u.churned).length;
    const totalLTV = similarUsers.reduce((s, u) => s + (u.lifetime_value ?? 0), 0);

    const actions = similarUsers
      .map((u) => u.last_action)
      .filter((action): action is string => Boolean(action));
    const actionCounts = actions.reduce<Record<string, number>>((c, a) => {
      c[a] = (c[a] ?? 0) + 1;
      return c;
    }, {});
    const nextAction = Object.keys(actionCounts).reduce(
      (a, b) => (actionCounts[a] > actionCounts[b] ? a : b),
      'unknown',
    );

    return {
      churnProbability: churnCount / similarUsers.length,
      lifetimeValue: totalLTV / similarUsers.length,
      nextAction,
      confidence: Math.min(0.9, similarUsers.length / 100),
    };
  }
}

export const analyticsEngineService = new AnalyticsEngineService();
