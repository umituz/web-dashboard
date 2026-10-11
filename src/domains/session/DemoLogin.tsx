/**
 * DemoLogin — one-click demo entry (fleet pattern: log in as a demo
 * persona without a password). Controlled: the click delegates to
 * `onDemo` (typically `session.demoLogin`); the label defaults to
 * the i18n catalog.
 */

import { UserRound } from "lucide-react";
import { Button } from "../../primitives";
import { useT } from "../../i18n";
import { SESSION_KEYS } from "./utils/i18nKeys";

export interface DemoLoginProps {
  onDemo: (userId: string) => void | Promise<void>;
  /** Demo user id to log in as. */
  userId: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  disabled?: boolean;
  className?: string;
}

export const DemoLogin = ({
  onDemo,
  userId,
  label,
  variant = "outline",
  size = "default",
  disabled = false,
  className,
}: DemoLoginProps) => {
  const t = useT();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      onClick={() => void onDemo(userId)}
    >
      <UserRound aria-hidden="true" />
      {label ?? t(SESSION_KEYS.demoLogin.action)}
    </Button>
  );
};

export default DemoLogin;
