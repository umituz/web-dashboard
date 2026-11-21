import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminModerationModal } from './AdminModerationModal';
import type { AdminUser } from '../types';

const activeUser: AdminUser = {
  id: 'u-1',
  name: 'Active User',
  email: 'active@example.com',
  roles: ['member'],
  status: 'active',
};

const suspendedUser: AdminUser = {
  id: 'u-2',
  name: 'Suspended User',
  email: 'suspended@example.com',
  roles: ['member'],
  status: 'suspended',
};

describe('AdminModerationModal', () => {
  it('renders moderation options for active user', () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <AdminModerationModal
        open={true}
        onClose={handleClose}
        targetUser={activeUser}
        onConfirm={handleConfirm}
      />,
    );

    expect(screen.getByText('Moderate user account')).toBeTruthy();
    expect(screen.getByText('Active User')).toBeTruthy();
    expect(screen.getByText('active@example.com')).toBeTruthy();
    expect(screen.getByText('Ban')).toBeTruthy();
    expect(screen.getByText('Suspend')).toBeTruthy();
  });

  it('submits ban action with reason', async () => {
    const handleConfirm = vi.fn();

    render(
      <AdminModerationModal
        open={true}
        onClose={vi.fn()}
        targetUser={activeUser}
        onConfirm={handleConfirm}
      />,
    );

    const textarea = screen.getByPlaceholderText('Explain the violation or cause for audit trail…');
    fireEvent.change(textarea, { target: { value: 'Spamming content' } });

    fireEvent.click(screen.getByText('Ban user'));
    expect(handleConfirm).toHaveBeenCalledWith({
      action: 'ban',
      reason: 'Spamming content',
      durationDays: undefined,
    });
  });

  it('switches to suspend action and submits durationDays', async () => {
    const handleConfirm = vi.fn();

    render(
      <AdminModerationModal
        open={true}
        onClose={vi.fn()}
        targetUser={activeUser}
        onConfirm={handleConfirm}
      />,
    );

    fireEvent.click(screen.getByText('Suspend'));
    expect(screen.getByText('Suspension duration (days)')).toBeTruthy();

    fireEvent.click(screen.getByText('Suspend user'));
    expect(handleConfirm).toHaveBeenCalledWith({
      action: 'suspend',
      reason: undefined,
      durationDays: 7,
    });
  });

  it('renders reinstate mode for suspended user', () => {
    const handleConfirm = vi.fn();

    render(
      <AdminModerationModal
        open={true}
        onClose={vi.fn()}
        targetUser={suspendedUser}
        onConfirm={handleConfirm}
      />,
    );

    expect(screen.getByText('Reinstate suspended account')).toBeTruthy();
    expect(screen.getByText('Reinstate account')).toBeTruthy();

    fireEvent.click(screen.getByText('Reinstate account'));
    expect(handleConfirm).toHaveBeenCalledWith({
      action: 'reinstate',
      reason: undefined,
      durationDays: undefined,
    });
  });
});
