export interface DashboardNotification {
    id: string;
    text: string;
    read: boolean;
    createdAt: Date | string | number;
    to?: string;
    onSelect?: () => void;
}
