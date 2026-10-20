export interface DashboardHeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    setMobileOpen: (open: boolean) => void;
    title: string;
    theme?: "light" | "dark";
    onToggleTheme?: () => void;
}

export interface HeaderProfileItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    to?: string;
    onSelect?: () => void;
    /** Renders the item in destructive color (sign-out, delete…). */
    danger?: boolean;
}

/** Optional primary action under the sidebar brand (replaces the legacy create-post button). */
export interface SidebarAction {
    label: string;
    icon?: import("lucide-react").LucideIcon;
    to?: string;
    onClick?: () => void;
}

/** Header search affordance — a button styled as a search field, e.g. routing to a search page. */
export interface HeaderSearchAction {
    placeholder?: string;
    shortcut?: string;
    onActivate: () => void;
}

export interface DashboardSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export interface DashboardLayoutConfig {
    sidebarGroups: import('./sidebar').SidebarGroup[];
    extraTitleMap?: Record<string, string>;
    defaultTitle?: string;
    brandName?: string;
    brandTagline?: string;
    /** Custom brand mark for the sidebar — replaces the built-in logo; pair with brandName for the text block. */
    brand?: React.ReactNode;
    sidebarAction?: SidebarAction;
    /** Extra node rendered in the sidebar footer (above the collapse button; hidden when collapsed). */
    sidebarFooter?: React.ReactNode;
    /** Extra node rendered in the header actions area (app chips, clocks…). */
    headerExtra?: React.ReactNode;
    searchAction?: HeaderSearchAction;
    /** Fully custom profile menu items — shown in addition to (or, with showDefaultProfileItems=false, instead of) the defaults. */
    profileItems?: HeaderProfileItem[];
    /** Hide the built-in profile/settings items (defaults to true). */
    showDefaultProfileItems?: boolean;
    /** "View all" row appended to the notifications dropdown. */
    notificationsViewAll?: { label: string; to: string };
}
