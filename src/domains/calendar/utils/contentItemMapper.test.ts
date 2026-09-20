/**
 * Tests for the calendar Firestore → ContentItem mappers.
 */

import { describe, it, expect } from "vitest";
import { mapCalendarDocument, mapPostDocument } from "./contentItemMapper";
import type { FirestoreDocument } from "./contentItemMapper";

const makeDoc = (data: Record<string, unknown>): FirestoreDocument => ({
  id: "doc-1",
  data: () => data as never,
});

describe("mapCalendarDocument", () => {
  it("maps a fully populated document", () => {
    const item = mapCalendarDocument(
      makeDoc({
        title: "Launch post",
        description: "Hello world",
        scheduled_at: "2026-09-01T10:00:00.000Z",
        platforms: ["twitter", "linkedin"],
        app_name: "MyApp",
        status: "scheduled",
        type: "post",
      }),
    );

    expect(item).toEqual({
      id: "doc-1",
      title: "Launch post",
      description: "Hello world",
      scheduled_at: "2026-09-01T10:00:00.000Z",
      platforms: ["twitter", "linkedin"],
      app_name: "MyApp",
      status: "scheduled",
      type: "post",
    });
  });

  it("falls back to empty strings, never to package-side copy", () => {
    const item = mapCalendarDocument(makeDoc({}));

    expect(item.title).toBe("");
    expect(item.description).toBe("");
    expect(item.app_name).toBe("");
    expect(item.platforms).toEqual([]);
  });

  it("normalizes unknown status/type to draft/post", () => {
    const item = mapCalendarDocument(
      makeDoc({ status: "weird", type: "unsupported" }),
    );
    expect(item.status).toBe("draft");
    expect(item.type).toBe("post");
  });

  it("converts Firestore timestamps via toDate()", () => {
    const item = mapCalendarDocument(
      makeDoc({
        scheduled_at: { toDate: () => new Date("2026-09-01T00:00:00.000Z") },
      }),
    );
    expect(item.scheduled_at).toBe("2026-09-01T00:00:00.000Z");
  });

  it("maps a missing scheduled_at to the epoch, not 'now'", () => {
    const item = mapCalendarDocument(makeDoc({}));
    expect(item.scheduled_at).toBe(new Date(0).toISOString());
  });

  it("prefers camelCase appName as fallback", () => {
    const item = mapCalendarDocument(makeDoc({ appName: "CamelApp" }));
    expect(item.app_name).toBe("CamelApp");
  });
});

describe("mapPostDocument", () => {
  it("maps a posts-collection document", () => {
    const item = mapPostDocument(
      makeDoc({
        title: "Post title",
        content: "Body text",
        scheduledAt: "2026-10-01T08:00:00.000Z",
        platform: "instagram",
        appName: "MyApp",
        status: "published",
      }),
    );

    expect(item).toEqual({
      id: "doc-1",
      title: "Post title",
      description: "Body text",
      scheduled_at: "2026-10-01T08:00:00.000Z",
      platforms: ["instagram"],
      app_name: "MyApp",
      status: "published",
      type: "post",
    });
  });

  it("falls back to empty strings for missing display fields", () => {
    const item = mapPostDocument(makeDoc({}));
    expect(item.title).toBe("");
    expect(item.description).toBe("");
    expect(item.platforms).toEqual([]);
  });
});
