import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "../permissions/types";

export interface DashboardModule {
    path: string;
    labelKey: string;
    icon: LucideIcon;
    navGroup: string;
    element: ReactNode;
    permission?: Permission;
    order?: number;
    inNav?: boolean;
}
