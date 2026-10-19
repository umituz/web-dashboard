export interface DashboardTheme {
    primary?: string;
    secondary?: string;
    sidebarBackground?: string;
    sidebarForeground?: string;
    sidebarBorder?: string;
    headerBackground?: string;
    background?: string;
    foreground?: string;
    border?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    muted?: string;
    mutedForeground?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    radius?: string;
}

export interface DashboardThemePreset {
    name: string;
    theme: DashboardTheme;
    dark?: boolean;
}
