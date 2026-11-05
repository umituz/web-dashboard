export type TourPlacement = "top" | "right" | "bottom" | "left" | "center";
export type TourAlign = "start" | "center" | "end";

export interface TourStep {
  target?: string;
  title: string;
  description: string;
  placement?: TourPlacement;
  align?: TourAlign;
  badge?: string;
}

export interface TourLabels {
  next?: string;
  prev?: string;
  done?: string;
  skip?: string;
  progress?: string;
}

export interface TourConfig {
  tourId: string;
  userId?: string;
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
  autoStart?: boolean;
  autoStartDelayMs?: number;
  onComplete?: () => void;
  onSkip?: () => void;
  onStepChange?: (index: number, step: TourStep) => void;
}

export interface UseProductTourReturn {
  startTour: (options?: { force?: boolean }) => void;
  restartTour: () => void;
  destroyTour: () => void;
  hasCompleted: boolean;
  isTourActive: boolean;
}
