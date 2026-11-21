import type { ReactNode } from 'react';

export interface AdminNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: ReactNode;
  readonly badge?: ReactNode;
  readonly exact?: boolean;
}

export type AdminUserStatus = 'active' | 'suspended' | 'banned' | 'pending';

export interface AdminUser<TMeta = Record<string, unknown>> {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl?: string;
  readonly roles: readonly string[];
  readonly status: AdminUserStatus;
  readonly createdAt?: string | number | Date;
  readonly lastActiveAt?: string | number | Date;
  readonly metadata?: TMeta;
}

export type AdminUserStatusFilter = 'all' | AdminUserStatus;

export interface AdminKpiItem {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly sub?: string;
  readonly tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet';
  readonly icon?: ReactNode;
  readonly change?: {
    readonly value: number | string;
    readonly trend: 'up' | 'down' | 'neutral';
  };
}

export interface AdminServiceCheck {
  readonly name: string;
  readonly status: 'ok' | 'warn' | 'fail';
  readonly latencyMs?: number;
  readonly message?: string;
}

export interface AdminSystemHealth {
  readonly status: 'healthy' | 'degraded' | 'down';
  readonly latencyMs?: number;
  readonly version?: string;
  readonly uptime?: string;
  readonly lastCheckedAt?: string | number | Date;
  readonly checks?: readonly AdminServiceCheck[];
}

export interface AdminTenantSummary {
  readonly id: string;
  readonly name: string;
  readonly slug?: string;
  readonly plan: string;
  readonly status: 'active' | 'suspended' | 'trial';
  readonly usersCount?: number;
  readonly mrr?: string | number;
  readonly createdAt?: string | number | Date;
}
