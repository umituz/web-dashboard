export type TourPlacement = "top" | "right" | "bottom" | "left" | "center";
export type TourAlign = "start" | "center" | "end";

export interface TourStep {
  /**
   * DOM selector to attach popover to (e.g. `[data-tour="search-bar"]` or `header`).
   * When omitted or set to `'body'`, the step centers as a modal.
   */
  target?: string;
  /**
   * Step title displayed in bold in the popover header.
   */
  title: string;
  /**
   * Step description or HTML body.
   */
  description: string;
  /**
   * Optional placement side. Defaults to `'center'` if target is omitted, otherwise auto/bottom.
   */
  placement?: TourPlacement;
  /**
   * Alignment along the side (start, center, end).
   */
  align?: TourAlign;
  /**
   * Optional small badge text displayed before the title (e.g. "Yeni", "Adım 1").
   */
  badge?: string;
}

export interface TourLabels {
  next?: string;
  prev?: string;
  done?: string;
  skip?: string;
  progress?: string; // e.g. "{{current}} / {{total}}"
}

export interface TourConfig {
  tourId: string;
  /**
   * Optional user ID to isolate completion status per user on the same client.
   */
  userId?: string;
  /**
   * Optional external completion flag (e.g. from backend/database).
   */
  isCompleted?: boolean;
  steps: TourStep[];
  labels?: TourLabels;
  overlayOpacity?: number;
  stagePadding?: number;
  stageRadius?: number;
  animate?: boolean;
  smoothScroll?: boolean;
  allowClose?: boolean;
  popoverClass?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  onStepChange?: (index: number, step: TourStep) => void;
}

export interface TourEngineInstance {
  start: () => void;
  destroy: () => void;
  next: () => void;
  previous: () => void;
  isActive: () => boolean;
  getCurrentStepIndex: () => number;
}

export interface UseProductTourOptions extends Omit<TourConfig, "onComplete" | "onSkip" | "onStepChange"> {
  /**
   * If true, starts the tour automatically on mount when not yet completed.
   */
  autoStart?: boolean;
  /**
   * Delay in milliseconds before auto-starting the tour (default: 600ms).
   */
  autoStartDelayMs?: number;
  /**
   * Optional callback when completed.
   */
  onComplete?: () => void;
  /**
   * Optional callback when skipped/closed.
   */
  onSkip?: () => void;
  /**
   * Optional callback when step changes.
   */
  onStepChange?: (index: number, step: TourStep) => void;
}

export interface UseProductTourReturn {
  startTour: (options?: { force?: boolean }) => void;
  restartTour: () => void;
  destroyTour: () => void;
  hasCompleted: boolean;
  isTourActive: boolean;
}
