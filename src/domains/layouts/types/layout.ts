export interface DashboardHeaderLabels {
  switchToLight: string;
  switchToDark: string;
  notificationsTitle: string;
  markAllRead: string;
  dismissNotification: string;
  noNotifications: string;
  profile: string;
  settings: string;
  logout: string;
  guestName: string;
}

export interface DashboardSidebarLabels {
  system?: string;
}

export interface DashboardLayoutLabels {
  skipToContent: string;
  navigation: string;
  searchResults: string;
  header: DashboardHeaderLabels;
  sidebar: DashboardSidebarLabels;
}

export interface DashboardHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  title: string;
  labels: DashboardHeaderLabels;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  formatNotificationTime?: (createdAt: Date | string | number) => string;
}

export interface HeaderProfileItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  to?: string;
  onSelect?: () => void;
  danger?: boolean;
  roles?: readonly string[];
  permission?: string;
  anyOf?: readonly string[];
  permissions?: readonly string[];
}

export interface SidebarAction {
  label: string;
  icon?: import("lucide-react").LucideIcon;
  to?: string;
  onClick?: () => void;
}

export interface HeaderSearchAction {
  placeholder?: string;
  shortcut?: string;
  onActivate: () => void;
}

export interface CommandPaletteConfig {
  /** Static entry groups; palettes driven purely by `search` may omit them. */
  groups?: import("@umituz/web-design-system/organisms").CommandGroup[];
  placeholder?: string;
  emptyLabel?: string;
  label?: string;
  shortcut?: boolean;
  includeSidebar?: boolean;
  search?: (q: string) => Promise<import("@umituz/web-design-system/organisms").CommandItem[]>;
  searchResultsHeading?: string;
}

export interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  labels?: DashboardSidebarLabels;
}

export interface DashboardLayoutConfig {
  sidebarGroups: import("./sidebar").SidebarGroup[];
  extraTitleMap?: Record<string, string>;
  defaultTitle?: string;
  brandName?: string;
  brandTagline?: string;
  sidebarLabels?: DashboardSidebarLabels;
  brand?: React.ReactNode;
  sidebarAction?: SidebarAction;
  sidebarFooter?: React.ReactNode;
  headerExtra?: React.ReactNode;
  searchAction?: HeaderSearchAction;
  commandPalette?: CommandPaletteConfig;
  profileItems?: HeaderProfileItem[];
  showDefaultProfileItems?: boolean;
  notificationsViewAll?: { label: string; to: string };
}
