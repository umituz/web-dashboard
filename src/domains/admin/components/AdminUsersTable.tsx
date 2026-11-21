import { useMemo, useState, type ReactNode } from 'react';
import { Ban, Edit2, Eye, Trash2, UserCheck } from 'lucide-react';
import { Badge, Button, Input, NativeSelect } from '@umituz/web-design-system/atoms';
import { Avatar } from '@umituz/web-design-system/molecules';
import { Card, EmptyState } from '@umituz/web-design-system/organisms';
import { cn } from '@umituz/web-design-system/utils';
import type { AdminUser, AdminUserStatus, AdminUserStatusFilter } from '../types';

export interface AdminUsersTableProps {
  readonly users: readonly AdminUser[];
  readonly loading?: boolean;
  readonly searchPlaceholder?: string;
  readonly statusFilter?: AdminUserStatusFilter;
  readonly onStatusFilterChange?: (filter: AdminUserStatusFilter) => void;
  readonly onSearch?: (query: string) => void;
  readonly onEditRoles?: (user: AdminUser) => void;
  readonly onModerate?: (user: AdminUser, action: 'ban' | 'suspend' | 'activate') => void;
  readonly onViewDetails?: (user: AdminUser) => void;
  readonly onDelete?: (user: AdminUser) => void;
  readonly actions?: (user: AdminUser) => ReactNode;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly className?: string;
}

const STATUS_VARIANTS: Record<AdminUserStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  active: 'success',
  suspended: 'warning',
  banned: 'danger',
  pending: 'neutral',
};

export function AdminUsersTable({
  users,
  loading = false,
  searchPlaceholder = 'Search users by name or email…',
  statusFilter = 'all',
  onStatusFilterChange,
  onSearch,
  onEditRoles,
  onModerate,
  onViewDetails,
  onDelete,
  actions,
  emptyTitle = 'No users found',
  emptyDescription = 'There are no users matching your filter or query.',
  className,
}: AdminUsersTableProps) {
  const [internalQuery, setInternalQuery] = useState('');
  const [internalStatus, setInternalStatus] = useState<AdminUserStatusFilter>(statusFilter);

  const activeStatus = onStatusFilterChange ? statusFilter : internalStatus;

  const handleQueryChange = (q: string) => {
    setInternalQuery(q);
    onSearch?.(q);
  };

  const handleStatusChange = (s: AdminUserStatusFilter) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(s);
    } else {
      setInternalStatus(s);
    }
  };

  const filteredUsers = useMemo(() => {
    if (onSearch || onStatusFilterChange) return users;
    const q = internalQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (activeStatus !== 'all' && u.status !== activeStatus) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, internalQuery, activeStatus, onSearch, onStatusFilterChange]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 max-w-sm">
          <Input
            value={internalQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <NativeSelect
            value={activeStatus}
            onChange={(e) => handleStatusChange(e.target.value as AdminUserStatusFilter)}
            aria-label="Filter users by status"
            className="w-36 text-xs"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </NativeSelect>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center p-8 text-sm text-ink-3">
          <span className="animate-pulse">Loading users…</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-8">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-100 text-2xs font-semibold uppercase tracking-wider text-ink-3">
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Roles</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Created</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {filteredUsers.map((user) => {
                const dateStr = user.createdAt
                  ? typeof user.createdAt === 'string'
                    ? user.createdAt.slice(0, 10)
                    : new Date(user.createdAt).toISOString().slice(0, 10)
                  : '—';

                return (
                  <tr key={user.id} className="transition-colors hover:bg-surface-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div className="min-w-0">
                          <span className="block font-semibold text-ink leading-tight">{user.name}</span>
                          <span className="block text-xs text-ink-3 truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <Badge key={r} variant="outline" className="text-2xs capitalize">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={STATUS_VARIANTS[user.status]} className="capitalize text-2xs">
                        {user.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-ink-3">{dateStr}</td>

                    <td className="py-3 px-4 text-right">
                      {actions ? (
                        actions(user)
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          {onViewDetails && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetails(user)}
                              aria-label="View user details"
                              className="h-8 w-8 p-0"
                            >
                              <Eye size={14} />
                            </Button>
                          )}

                          {onEditRoles && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditRoles(user)}
                              aria-label="Edit roles"
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 size={13} />
                            </Button>
                          )}

                          {onModerate && user.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onModerate(user, 'suspend')}
                              aria-label="Suspend user"
                              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                            >
                              <Ban size={13} />
                            </Button>
                          )}

                          {onModerate && user.status !== 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onModerate(user, 'activate')}
                              aria-label="Activate user"
                              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700"
                            >
                              <UserCheck size={14} />
                            </Button>
                          )}

                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(user)}
                              aria-label="Delete user"
                              className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 size={13} />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
