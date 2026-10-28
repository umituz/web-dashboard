import { describe, expect, it } from "vitest";
import { isTourCompleted, markTourCompleted, resetTourCompletion } from "./tourEngine";

describe("Tour Engine & User Isolation", () => {
  it("defaults to false and toggles completed state", () => {
    const tourId = "onboarding_test_tour";
    resetTourCompletion(tourId);
    expect(isTourCompleted(tourId)).toBe(false);

    markTourCompleted(tourId);
    expect(isTourCompleted(tourId)).toBe(true);

    resetTourCompletion(tourId);
    expect(isTourCompleted(tourId)).toBe(false);
  });

  it("isolates tour completion per user", () => {
    const tourId = "role_isolated_tour";
    const userA = "user_student_123";
    const userB = "user_teacher_456";

    resetTourCompletion(tourId, userA);
    resetTourCompletion(tourId, userB);

    expect(isTourCompleted(tourId, userA)).toBe(false);
    expect(isTourCompleted(tourId, userB)).toBe(false);

    markTourCompleted(tourId, userA);
    expect(isTourCompleted(tourId, userA)).toBe(true);
    expect(isTourCompleted(tourId, userB)).toBe(false);

    markTourCompleted(tourId, userB);
    expect(isTourCompleted(tourId, userA)).toBe(true);
    expect(isTourCompleted(tourId, userB)).toBe(true);

    resetTourCompletion(tourId, userA);
    expect(isTourCompleted(tourId, userA)).toBe(false);
    expect(isTourCompleted(tourId, userB)).toBe(true);
  });
});
