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
 * Analytics Engine Service
 *
 * Singleton service for advanced analytics calculations
 */
export class AnalyticsEngineService {
  private static instance: AnalyticsEngineService;

  private constructor() {}

  public static getInstance(): AnalyticsEngineService {
    if (!AnalyticsEngineService.instance) {
      AnalyticsEngineService.instance = new AnalyticsEngineService();
    }
    return AnalyticsEngineService.instance;
  }

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
          if (!user.last_activity) return false;
          const signupDate = new Date(user.signup_date!);
          const targetDate = new Date(signupDate.getFullYear(), signupDate.getMonth() + month, 1);
          return new Date(user.last_activity) >= targetDate;
        }).length;

        retention.push((activeUsersCount / users.length) * 100);
      }

      cohortAnalysis.push({
        cohort,
        size: users.length,
        retention,
        averageRetention: retention.reduce((a, b) => a + b, 0) / retention.length,
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
        path.value += conversion.value || 0;
        totalConversions++;
      }
    });

    return Array.from(paths.entries())
      .map(([pathString, path]) => ({
        path: pathString.split(' → '),
        conversions: path.count,
        value: path.value,
        abandonmentRate:
          totalConversions > 0 ? ((totalConversions - path.count) / totalConversions) * 100 : 0,
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
      const stepCount = data.filter((item) => item[step]).length;
      const conversionRate =
        index === 0 ? 100 : previousCount > 0 ? (stepCount / previousCount) * 100 : 0;
      previousCount = stepCount;

      const stepData = data.filter((item) => item[step]);
      const avgTime =
        stepData.length > 0
          ? stepData.reduce((sum, item) => sum + (item.time_spent || 0), 0) / stepData.length
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
      finalConversion: funnelSteps[funnelSteps.length - 1]?.conversionRate || 0,
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
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
      chars: string[]
    ) => {
      const users = data.filter(filter);
      const avg = (field: string) =>
        users.length === 0
          ? 0
          : users.reduce((s, i) => s + ((i as any)[field] || 0), 0) / users.length;

      return {
        name,
        count: users.length,
        percentage: (users.length / data.length) * 100,
        characteristics: chars,
        behavior: {
          avgSessionDuration: avg('session_duration'),
          pagesPerSession: avg('pages_per_session'),
          bounceRate: avg('bounce_rate'),
        },
      };
    };

    return [
      defineSegment('Active', (u) => u.last_login_days! <= 7, [
        'Recent login',
        'High engagement',
      ]),
      defineSegment('Moderate', (u) => u.last_login_days! > 7 && u.last_login_days! <= 30, [
        'Occasional login',
      ]),
      defineSegment('Inactive', (u) => u.last_login_days! > 30, [
        'Churn risk',
        'Low activity',
      ]),
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
    historicalData: UserData[]
  ): UserBehaviorPrediction {
    const similarUsers = historicalData.filter(
      (u) => Math.abs((u.age || 0) - (user.age || 0)) < 5 && u.location === user.location
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
    const totalLTV = similarUsers.reduce((s, u) => s + (u.lifetime_value || 0), 0);

    // Predict next action based on frequency in similar users
    const actions = similarUsers.map((u) => u.last_action).filter(Boolean) as string[];
    const actionCounts = actions.reduce((c: Record<string, number>, a) => {
      c[a] = (c[a] || 0) + 1;
      return c;
    }, {});
    const nextAction = Object.keys(actionCounts).reduce(
      (a, b) => (actionCounts[a] > actionCounts[b] ? a : b),
      'unknown'
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
 * Singleton instance
 */
export const analyticsEngineService = AnalyticsEngineService.getInstance();
