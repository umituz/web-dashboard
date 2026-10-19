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
}
