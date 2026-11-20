import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TourConfig, TourEngineInstance, UseProductTourOptions, UseProductTourReturn } from "./types";
import { createProductTour, isTourCompleted, resetTourCompletion } from "./tourEngine";
import { useReducedMotion } from "../onboarding/hooks/useReducedMotion";

export function useProductTour(options: UseProductTourOptions): UseProductTourReturn {
  const {
    tourId,
    userId,
    isCompleted,
    steps,
    labels,
    overlayOpacity,
    stagePadding,
    stageRadius,
    animate,
    smoothScroll,
    allowClose,
    autoStart = false,
    autoStartDelayMs = 600,
    onComplete,
    onSkip,
    onStepChange,
  } = options;

  const [hasCompleted, setHasCompleted] = useState<boolean>(() => {
    return Boolean(isCompleted) || isTourCompleted(tourId, userId);
  });
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const engineRef = useRef<TourEngineInstance | null>(null);

  useEffect(() => {
    setHasCompleted(Boolean(isCompleted) || isTourCompleted(tourId, userId));
  }, [isCompleted, tourId, userId]);

  const onCompleteRef = useRef(onComplete);
  const onSkipRef = useRef(onSkip);
  const onStepChangeRef = useRef(onStepChange);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onSkipRef.current = onSkip;
    onStepChangeRef.current = onStepChange;
  });

  const prefersReducedMotion = useReducedMotion();

  const config: TourConfig = useMemo(
    () => ({
      tourId,
      userId,
      isCompleted,
      steps,
      labels,
      overlayOpacity,
      stagePadding,
      stageRadius,
      animate: prefersReducedMotion ? false : animate,
      smoothScroll: prefersReducedMotion ? false : smoothScroll,
      allowClose,
      onComplete: () => {
        setHasCompleted(true);
        setIsTourActive(false);
        onCompleteRef.current?.();
      },
      onSkip: () => {
        setHasCompleted(true);
        setIsTourActive(false);
        onSkipRef.current?.();
      },
      onStepChange: (index, step) => {
        onStepChangeRef.current?.(index, step);
      },
    }),
    [
      tourId,
      userId,
      isCompleted,
      steps,
      labels,
      overlayOpacity,
      stagePadding,
      stageRadius,
      animate,
      smoothScroll,
      allowClose,
      prefersReducedMotion,
    ],
  );

  const startTour = useCallback(
    (startOptions?: { force?: boolean }) => {
      const force = startOptions?.force ?? false;
      const alreadyDone = Boolean(isCompleted) || isTourCompleted(tourId, userId);
      if (!force && alreadyDone) {
        return;
      }

      if (engineRef.current?.isActive()) {
        engineRef.current.destroy();
      }

      const instance = createProductTour(config);
      engineRef.current = instance;
      setIsTourActive(true);
      instance.start();
    },
    [config, tourId, userId, isCompleted],
  );

  const restartTour = useCallback(() => {
    resetTourCompletion(tourId, userId);
    setHasCompleted(false);
    startTour({ force: true });
  }, [tourId, userId, startTour]);

  const destroyTour = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.destroy();
      setIsTourActive(false);
    }
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    const alreadyDone = Boolean(isCompleted) || isTourCompleted(tourId, userId);
    if (alreadyDone) return;

    const timer = window.setTimeout(() => {
      startTour();
    }, autoStartDelayMs);

    return () => {
      window.clearTimeout(timer);
      if (engineRef.current?.isActive()) {
        engineRef.current.destroy();
      }
    };
  }, [autoStart, autoStartDelayMs, tourId, userId, isCompleted, startTour]);

  return {
    startTour,
    restartTour,
    destroyTour,
    hasCompleted,
    isTourActive,
  };
}
