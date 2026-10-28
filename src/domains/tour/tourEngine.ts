import { driver } from "driver.js";
import type { Config as DriverConfig, Driver, DriveStep } from "driver.js";
import type { TourConfig, TourEngineInstance } from "./types";

const STORAGE_PREFIX = "umituz_tour_";
const memoryTourStore = new Map<string, string>();

function getStorageKey(tourId: string, userId?: string): string {
  return userId ? `${STORAGE_PREFIX}${userId}_${tourId}` : `${STORAGE_PREFIX}${tourId}`;
}

/**
 * Checks whether a given tour has been completed or dismissed by the user.
 */
export function isTourCompleted(tourId: string, userId?: string): boolean {
  const key = getStorageKey(tourId, userId);
  if (typeof window === "undefined" || !window.localStorage) {
    return memoryTourStore.get(key) === "completed";
  }
  try {
    return window.localStorage.getItem(key) === "completed";
  } catch {
    return memoryTourStore.get(key) === "completed";
  }
}

/**
 * Marks a tour as completed in localStorage (with in-memory fallback).
 */
export function markTourCompleted(tourId: string, userId?: string): void {
  const key = getStorageKey(tourId, userId);
  memoryTourStore.set(key, "completed");
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, "completed");
  } catch {
    // ignore storage errors
  }
}

/**
 * Resets the tour completion state so it can be re-run.
 */
export function resetTourCompletion(tourId: string, userId?: string): void {
  const key = getStorageKey(tourId, userId);
  memoryTourStore.delete(key);
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

let activeDriverInstance: Driver | null = null;

/**
 * Instantiates and returns a TourEngineInstance wrapping driver.js.
 */
export function createProductTour(config: TourConfig): TourEngineInstance {
  const {
    tourId,
    steps,
    labels = {},
    overlayOpacity = 0.65,
    stagePadding = 8,
    stageRadius = 12,
    animate = true,
    smoothScroll = true,
    allowClose = true,
    popoverClass,
    onComplete,
    onSkip,
    onStepChange,
  } = config;

  const nextBtnDefault = labels.next;
  const prevBtnDefault = labels.prev;
  const doneBtnDefault = labels.done;
  const progressTextTemplate = labels.progress ?? "{{current}} / {{total}}";

  let completedSuccessfully = false;

  const driveSteps: DriveStep[] = steps.map((step, index) => {
    const isLast = index === steps.length - 1;
    const targetSelector = step.target && step.target !== "body" ? step.target : undefined;

    const formattedTitle = step.badge
      ? `<span style="display:inline-block;padding:2px 8px;font-size:11px;font-weight:700;border-radius:9999px;background-color:rgba(59,122,94,0.15);color:#3b7a5e;margin-right:6px;vertical-align:middle;">${step.badge}</span>${step.title}`
      : step.title;

    return {
      element: targetSelector,
      popover: {
        title: formattedTitle,
        description: step.description,
        side: step.placement && step.placement !== "center" ? step.placement : undefined,
        align: step.align ?? "center",
        nextBtnText: isLast ? doneBtnDefault : nextBtnDefault,
        prevBtnText: prevBtnDefault,
        showProgress: true,
        progressText: progressTextTemplate,
        onNextClick: (_element, _step, opts) => {
          if (isLast) {
            completedSuccessfully = true;
            markTourCompleted(tourId, config.userId);
            opts.driver.destroy();
            onComplete?.();
          } else {
            opts.driver.moveNext();
          }
        },
      },
    };
  });

  const driverConfig: DriverConfig = {
    steps: driveSteps,
    animate,
    smoothScroll,
    allowClose,
    overlayOpacity,
    stagePadding,
    stageRadius,
    popoverClass: popoverClass ? `driver-popover ${popoverClass}` : "driver-popover",
    showProgress: true,
    progressText: progressTextTemplate,
    nextBtnText: nextBtnDefault,
    prevBtnText: prevBtnDefault,
    doneBtnText: doneBtnDefault,
    onHighlightStarted: (_element, _step, opts) => {
      const activeIdx = opts.state.activeIndex ?? 0;
      const currentTourStep = steps[activeIdx];
      if (currentTourStep) {
        onStepChange?.(activeIdx, currentTourStep);
      }
    },
    onDestroyed: () => {
      activeDriverInstance = null;
      if (!completedSuccessfully) {
        markTourCompleted(tourId, config.userId);
        onSkip?.();
      }
    },
  };

  const driverObj = driver(driverConfig);

  return {
    start: () => {
      if (activeDriverInstance) {
        try {
          activeDriverInstance.destroy();
        } catch {
          // ignore
        }
      }
      activeDriverInstance = driverObj;
      completedSuccessfully = false;
      driverObj.drive();
    },
    destroy: () => {
      driverObj.destroy();
    },
    next: () => {
      driverObj.moveNext();
    },
    previous: () => {
      driverObj.movePrevious();
    },
    isActive: () => driverObj.isActive(),
    getCurrentStepIndex: () => driverObj.getActiveIndex() ?? 0,
  };
}
