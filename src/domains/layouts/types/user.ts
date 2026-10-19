import type { ComponentType } from "react";

export interface DashboardUser {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    hasMobileApp?: boolean;
    hasWebApp?: boolean;
}

export interface UserNavMenuItem {
    label: string;
    icon: ComponentType<{ className?: string }>;
    path: string;
}
