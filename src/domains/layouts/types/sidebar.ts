import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
    label: string;
    icon: LucideIcon;
    path: string;
    requiredApp?: 'mobile' | 'web';
    enabled?: boolean;
    badge?: string | number;
    secondaryLabel?: string;
    end?: boolean;
    roles?: readonly string[];
    permission?: string;
    permissions?: readonly string[];
}

export interface SidebarGroup {
    title?: string;
    items: SidebarItem[];
}
