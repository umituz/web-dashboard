/**
 * Analytics Engine Service
 *
 * Advanced analytics operations including cohort analysis, funnel analysis,
 * user segmentation, behavior prediction, and conversion path analysis.
 */

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

/**
 * Numeric metric keys supported by segment aggregation.
 * Constrained to a string union to avoid `any` lookups at runtime.
 */
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

/**
 * Safe numeric accessor for a UserData field.
 * Returns 0 when the field is missing or not a number, instead of forcing a cast.
 */
const getNumericMetric = (user: UserData, key: NumericUserMetric): number => {
  const value = user[key];
  return typeof value === 'number' ? value : 0;
};

/**
 * Segmentation thresholds (in days since last login).
 */
const SEGMENT_THRESHOLDS = {
  activeDays: 7,
  moderateDays: 30,
} as const;

/**
 * Analytics Engine Service
 *
 * Pure-functional service for advanced analytics calculations.
 * Stateless and testable: instantiate with `new AnalyticsEngineService()`.
 */
export class AnalyticsEngineService {
  /**
   * Calculate cohort retention analysis
   *
   * @param data - User data with signup and activity dates
   * @returns Cohort analysis with retention rates
   */
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

  /**
   * Analyze conversion paths
   *
   * @param data - Conversion data with paths and values
   * @returns Conversion path analysis
   */
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

  /**
   * Calculate funnel analysis
   *
   * @param data - Funnel data with step indicators
   * @param steps - Funnel step names
   * @returns Funnel analysis data
   */
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

  /**
   * Generate activity heatmap
   *
   * @param data - Activity data with timestamps
   * @returns Heatmap data by day and hour
   */
  public generateActivityHeatmap(data: ActivityItem[]): HeatmapData[] {
    const heatmap: HeatmapData[] = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const count = data.filter((item) => {
          const d = new Date(item.timestamp);
          return d.getDay() === day && d.getHours() === hour;
        }).length;

        heatmap.push({ day: days[day], hour, value: count });
      }
    }
    return heatmap;
  }

  /**
   * Segment users by behavior
   *
   * @param data - User data
   * @returns User segments
   */
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

  /**
   * Predict user behavior
   *
   * @param user - Target user
   * @param historicalData - Historical user data
   * @returns Behavior prediction
   */
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

/**
 * Default instance for convenience.
 * The class is also exported so consumers can instantiate a fresh one for tests.
 */
export const analyticsEngineService = new AnalyticsEngineService();
