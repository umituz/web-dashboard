import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
    label: string;
    icon: LucideIcon;
    path: string;
    requiredApp?: 'mobile' | 'web';
    enabled?: boolean;
    /** Count pill rendered next to the label (hidden while the sidebar is collapsed). */
    badge?: string | number;
    /**
     * Active-route matching: true (default) matches the exact path only;
     * false also marks prefix descendants active (e.g. /app on /app/vocab).
     */
    end?: boolean;
    /** Render the label verbatim — skip the localization humanizer (final display strings). */
    raw?: boolean;
}

export interface SidebarGroup {
    title: string;
    items: SidebarItem[];
    titleMap?: Record<string, string>;
}
