/**
 * Card stack motion math.
 * Owns the scale/opacity transitions used by TinderCardsScreen and similar
 * stack-style screens. Tuning these in one place keeps the stack feel consistent.
 */

const MOTION_ENTER_DURATION_MS = 250;
const INITIAL_SCALE = 0.95;
const STEADY_SCALE = 1;
const EXIT_SCALE = 1.05;
const HIDDEN_OPACITY = 0;
const VISIBLE_OPACITY = 1;

export interface CardMotionState {
  readonly opacity: number;
  readonly scale: number;
}

export function getCardEnterInitial(): CardMotionState {
  return { opacity: HIDDEN_OPACITY, scale: INITIAL_SCALE };
}

export function getCardEnterAnimate(): CardMotionState {
  return { opacity: VISIBLE_OPACITY, scale: STEADY_SCALE };
}

export function getCardEnterExit(): CardMotionState {
  return { opacity: HIDDEN_OPACITY, scale: EXIT_SCALE };
}

export function getCardTransitionDurationMs(): number {
  return MOTION_ENTER_DURATION_MS;
}
