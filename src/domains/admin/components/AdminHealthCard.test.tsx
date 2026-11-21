import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminHealthCard } from './AdminHealthCard';
import type { AdminSystemHealth } from '../types';

const sampleHealth: AdminSystemHealth = {
  status: 'healthy',
  latencyMs: 42,
  uptime: '99.99%',
  version: 'v2.4.0',
  checks: [
    { name: 'Database connection', status: 'ok', latencyMs: 12 },
    { name: 'Edge Worker', status: 'ok', latencyMs: 8 },
    { name: 'Redis Cache', status: 'warn', latencyMs: 95, message: 'High load' },
  ],
};

describe('AdminHealthCard', () => {
  it('renders title, status label, and metrics', () => {
    render(<AdminHealthCard health={sampleHealth} />);
    expect(screen.getByText('System Telemetry')).toBeTruthy();
    expect(screen.getByText('Operational')).toBeTruthy();
    expect(screen.getByText('42ms')).toBeTruthy();
    expect(screen.getByText('99.99%')).toBeTruthy();
    expect(screen.getByText('v2.4.0')).toBeTruthy();
  });

  it('renders service checks list', () => {
    render(<AdminHealthCard health={sampleHealth} />);
    expect(screen.getByText('Database connection')).toBeTruthy();
    expect(screen.getByText('Edge Worker')).toBeTruthy();
    expect(screen.getByText('Redis Cache')).toBeTruthy();
    expect(screen.getByText('High load')).toBeTruthy();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const handleRefresh = vi.fn();
    render(<AdminHealthCard health={sampleHealth} onRefresh={handleRefresh} />);
    fireEvent.click(screen.getByLabelText('Refresh telemetry'));
    expect(handleRefresh).toHaveBeenCalled();
  });
});
