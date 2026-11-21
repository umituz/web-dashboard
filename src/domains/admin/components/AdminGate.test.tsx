import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminGate } from './AdminGate';

describe('AdminGate', () => {
  it('renders children when isAdmin is true', () => {
    render(
      <AdminGate isAdmin={true}>
        <div>Privileged admin content</div>
      </AdminGate>,
    );
    expect(screen.getByText('Privileged admin content')).toBeTruthy();
  });

  it('renders loading state when isLoading is true', () => {
    render(
      <AdminGate isAdmin={false} isLoading={true}>
        <div>Hidden content</div>
      </AdminGate>,
    );
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.queryByText('Hidden content')).toBeNull();
  });

  it('renders default AccessDenied when isAdmin is false', () => {
    render(
      <AdminGate isAdmin={false}>
        <div>Hidden content</div>
      </AdminGate>,
    );
    expect(screen.getByText('Admin Access Required')).toBeTruthy();
    expect(screen.queryByText('Hidden content')).toBeNull();
  });

  it('renders custom fallback when provided and isAdmin is false', () => {
    render(
      <AdminGate isAdmin={false} fallback={<div>Custom unauthorized message</div>}>
        <div>Hidden content</div>
      </AdminGate>,
    );
    expect(screen.getByText('Custom unauthorized message')).toBeTruthy();
    expect(screen.queryByText('Hidden content')).toBeNull();
  });
});
