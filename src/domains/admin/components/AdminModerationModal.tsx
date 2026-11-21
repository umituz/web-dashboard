import { useEffect, useState } from 'react';
import { AlertTriangle, Ban, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Badge, Button, Input, Textarea } from '@umituz/web-design-system/atoms';
import { Modal } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminModerationAction, AdminModerationPayload, AdminUser } from '../types';

export interface AdminModerationModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly targetUser: AdminUser | null;
  readonly onConfirm: (payload: AdminModerationPayload) => void | Promise<void>;
  readonly loading?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly banWarning?: string;
  readonly suspendWarning?: string;
  readonly className?: string;
}

export function AdminModerationModal({
  open,
  onClose,
  targetUser,
  onConfirm,
  loading = false,
  title,
  description,
  banWarning = 'Banning is permanent. The user will immediately lose access to their account and resources.',
  suspendWarning = 'The user will be temporarily suspended and unable to sign in for the specified duration.',
  className,
}: AdminModerationModalProps) {
  const [action, setAction] = useState<'ban' | 'suspend'>('ban');
  const [reason, setReason] = useState('');
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    if (open) {
      setAction('ban');
      setReason('');
      setDurationDays(7);
    }
  }, [open, targetUser]);

  if (!targetUser) return null;

  const isRestoring = targetUser.status === 'suspended' || targetUser.status === 'banned';

  const defaultTitle = isRestoring
    ? targetUser.status === 'banned'
      ? 'Unban user account'
      : 'Reinstate suspended account'
    : 'Moderate user account';

  const defaultDescription = isRestoring
    ? `Restore platform access for ${targetUser.name} (${targetUser.email}).`
    : `Apply moderation action to ${targetUser.name} (${targetUser.email}).`;

  const handleSubmit = async () => {
    const finalAction: AdminModerationAction = isRestoring
      ? targetUser.status === 'banned'
        ? 'activate'
        : 'reinstate'
      : action;

    await onConfirm({
      action: finalAction,
      reason: reason.trim() || undefined,
      durationDays: !isRestoring && action === 'suspend' ? durationDays : undefined,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? defaultTitle}
      description={description ?? defaultDescription}
      size="md"
      className={className}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {isRestoring ? (
            <Button
              variant="primary"
              icon={<CheckCircle2 size={16} />}
              onClick={handleSubmit}
              disabled={loading}
            >
              {targetUser.status === 'banned' ? 'Unban account' : 'Reinstate account'}
            </Button>
          ) : (
            <Button
              variant={action === 'ban' ? 'danger' : 'primary'}
              icon={action === 'ban' ? <Ban size={16} /> : <ShieldAlert size={16} />}
              onClick={handleSubmit}
              disabled={loading}
            >
              {action === 'ban' ? 'Ban user' : 'Suspend user'}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between p-3 rounded-lg border border-line-200 bg-surface-50">
          <div>
            <p className="text-sm font-semibold text-ink">{targetUser.name}</p>
            <p className="text-xs text-ink-3">{targetUser.email}</p>
          </div>
          <Badge
            tone={
              targetUser.status === 'active'
                ? 'success'
                : targetUser.status === 'suspended'
                ? 'warning'
                : 'danger'
            }
            small
            className="capitalize"
          >
            {targetUser.status}
          </Badge>
        </div>

        {isRestoring ? (
          <div className="space-y-3">
            <p className="text-sm text-ink-2">
              Confirming this action will immediately reactivate the user account and restore platform
              access.
            </p>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Note / Reason (optional)
              </label>
              <Textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional reason for audit trail…"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAction('ban')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition',
                  action === 'ban'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                    : 'border-line-200 bg-surface text-ink-2 hover:bg-surface-50',
                )}
              >
                <Ban size={16} />
                <span>Ban</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('suspend')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition',
                  action === 'suspend'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold'
                    : 'border-line-200 bg-surface text-ink-2 hover:bg-surface-50',
                )}
              >
                <ShieldAlert size={16} />
                <span>Suspend</span>
              </button>
            </div>

            {action === 'suspend' && (
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                  Suspension duration (days)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Reason for action
              </label>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the violation or cause for audit trail…"
              />
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-100 text-xs text-ink-3">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
              <span>{action === 'ban' ? banWarning : suspendWarning}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
