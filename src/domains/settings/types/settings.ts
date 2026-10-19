import type { LucideIcon } from "lucide-react";

export interface SettingsItem {
    key: string;
    label: string;
    description?: string;
    icon?: LucideIcon;
    path?: string;
    onClick?: () => void;
    enabled?: boolean;
    permission?: string;
    badge?: number;
}

export interface SettingsSection {
    title: string;
    key: string;
    items: SettingsItem[];
    icon?: LucideIcon;
}

export interface SettingsConfig {
    sections: SettingsSection[];
    brandName?: string;
    defaultRoute?: string;
}

export interface SettingsLayoutProps {
    config: SettingsConfig;
    currentPath?: string;
    onNavigate?: (path: string) => void;
}

export interface SettingsSectionProps {
    section: SettingsSection;
    currentPath?: string;
    onNavigate?: (path: string) => void;
    collapsed?: boolean;
}
