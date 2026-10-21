import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
    label: string;
    icon: LucideIcon;
    path: string;
    requiredApp?: 'mobile' | 'web';
    enabled?: boolean;
    badge?: string | number;
    end?: boolean;
}

export interface SidebarGroup {
    title: string;
    items: SidebarItem[];
}
