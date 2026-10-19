const SWIPE_THRESHOLD_PX = 120;
const DRAG_RANGE_PX = 200;
const OPACITY_MIDPOINT_PX = 50;
const FULL_OPACITY = 1;
const HALF_OPACITY = 0.5;
const ZERO_OPACITY = 0;
const MAX_ROTATION_DEG = 15;
const ZERO_ROTATION_DEG = 0;

export const SWIPE_DECISION_THRESHOLD_PX = SWIPE_THRESHOLD_PX;

export const SWIPE_ROTATION_RANGE: [number, number, number] = [
  -DRAG_RANGE_PX,
  ZERO_ROTATION_DEG,
  DRAG_RANGE_PX,
];

export const SWIPE_ROTATION_VALUES: [number, number, number] = [
  -MAX_ROTATION_DEG,
  ZERO_ROTATION_DEG,
  MAX_ROTATION_DEG,
];

export const SWIPE_LEFT_OPACITY_INPUT: [number, number, number] = [
  -DRAG_RANGE_PX,
  -OPACITY_MIDPOINT_PX,
  0,
];

export const SWIPE_LEFT_OPACITY_VALUES: [number, number, number] = [
  FULL_OPACITY,
  HALF_OPACITY,
  ZERO_OPACITY,
];

export const SWIPE_RIGHT_OPACITY_INPUT: [number, number, number] = [
  0,
  OPACITY_MIDPOINT_PX,
  DRAG_RANGE_PX,
];

export const SWIPE_RIGHT_OPACITY_VALUES: [number, number, number] = [
  ZERO_OPACITY,
  HALF_OPACITY,
  FULL_OPACITY,
];

export function didCrossRightSwipeThreshold(offsetX: number): boolean {
  return offsetX > SWIPE_THRESHOLD_PX;
}

export function didCrossLeftSwipeThreshold(offsetX: number): boolean {
  return offsetX < -SWIPE_THRESHOLD_PX;
}
