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

/** ⌘K command palette wired into the shell: renders the DS CommandPalette,
 *  binds ⌘K/Ctrl+K, and (unless searchAction overrides it) makes the header
 *  search button open the palette. */
export interface CommandPaletteConfig {
    groups: import("@umituz/web-design-system/organisms").CommandGroup[];
    placeholder?: string;
    emptyLabel?: string;
    label?: string;
    /** Bind ⌘K/Ctrl+K to open the palette (default true). */
    shortcut?: boolean;
    /** Append the sidebar groups as navigation groups — derived from
     *  sidebarGroups and routed internally, so apps never map their nav twice. */
    includeSidebar?: boolean;
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
    /** ⌘K palette — when set, the header search opens it (an explicit
     *  searchAction.onActivate still wins). */
    commandPalette?: CommandPaletteConfig;
    /** Fully custom profile menu items — shown in addition to (or, with showDefaultProfileItems=false, instead of) the defaults. */
    profileItems?: HeaderProfileItem[];
    /** Hide the built-in profile/settings items (defaults to true). */
    showDefaultProfileItems?: boolean;
    /** "View all" row appended to the notifications dropdown. */
    notificationsViewAll?: { label: string; to: string };
}
