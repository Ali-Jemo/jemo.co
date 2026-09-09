import { describe, it, expect } from "vitest";
import {
  IRAQ_GOVERNORATES,
  IRAQ_RIVERS,
  SEEDED_SPOTS,
  calculateDistanceKm,
  projectToSvg,
} from "@/lib/data/iq-map-data";

describe("IQ Map Data and Geometry", () => {
  it("contains all 18 Iraqi governorates with valid paths and centroids", () => {
    expect(IRAQ_GOVERNORATES).toHaveLength(18);

    IRAQ_GOVERNORATES.forEach((gov) => {
      expect(gov.nameAr).toBeTruthy();
      expect(gov.nameEn).toBeTruthy();
      expect(gov.path.startsWith("M")).toBe(true);
      expect(gov.center[0]).toBeGreaterThan(0);
      expect(gov.center[0]).toBeLessThan(800);
      expect(gov.center[1]).toBeGreaterThan(0);
      expect(gov.center[1]).toBeLessThan(780);
    });
  });

  it("contains valid Tigris and Euphrates river paths", () => {
    expect(IRAQ_RIVERS.tigris.startsWith("M")).toBe(true);
    expect(IRAQ_RIVERS.euphrates.startsWith("M")).toBe(true);
    expect(IRAQ_RIVERS.shattAlArab.startsWith("M")).toBe(true);
  });

  it("projects coordinates inside the 800x780 SVG viewBox", () => {
    // Baghdad
    const [bx, by] = projectToSvg(44.366, 33.315);
    expect(bx).toBeGreaterThan(300);
    expect(bx).toBeLessThan(500);
    expect(by).toBeGreaterThan(300);
    expect(by).toBeLessThan(500);

    // Basra
    const [sx, sy] = projectToSvg(47.783, 30.508);
    expect(sx).toBeGreaterThan(600);
    expect(sy).toBeGreaterThan(500);
  });

  it("calculates realistic geographic distances in kilometers", () => {
    // Baghdad to Basra distance is ~450 km
    const distBaghdadBasra = calculateDistanceKm(33.3152, 44.3661, 30.5081, 47.7835);
    expect(distBaghdadBasra).toBeGreaterThan(430);
    expect(distBaghdadBasra).toBeLessThan(480);

    // Distance to same point is 0
    const distSelf = calculateDistanceKm(33.3152, 44.3661, 33.3152, 44.3661);
    expect(distSelf).toBe(0);
  });

  it("seeds valid community spots with ratings and reviews", () => {
    expect(SEEDED_SPOTS.length).toBeGreaterThanOrEqual(10);
    SEEDED_SPOTS.forEach((spot) => {
      expect(spot.name).toBeTruthy();
      expect(spot.category).toBeTruthy();
      expect(spot.governorate).toBeTruthy();
      expect(spot.rating).toBeGreaterThanOrEqual(4.0);
      expect(spot.rating).toBeLessThanOrEqual(5.0);
      expect(spot.reviewsCount).toBeGreaterThan(0);
      expect(spot.reviews.length).toBeGreaterThan(0);
    });
  });
});
