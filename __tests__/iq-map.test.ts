import { describe, it, expect } from "vitest";
import {
  IRAQ_GOVERNORATES,
  IRAQ_RIVERS,
  IRAQ_HIGHWAYS,
  SEEDED_SPOTS,
  calculateDistanceKm,
  projectToSvg,
} from "@/lib/data/iq-map-data";

describe("IQ Map Data and Geometry", () => {
  it("contains all 18 Iraqi governorates with valid paths, districts, and details", () => {
    expect(IRAQ_GOVERNORATES).toHaveLength(18);

    IRAQ_GOVERNORATES.forEach((gov) => {
      expect(gov.nameAr).toBeTruthy();
      expect(gov.nameEn).toBeTruthy();
      expect(gov.capital).toBeTruthy();
      expect(gov.description).toBeTruthy();
      expect(gov.areaKm2).toBeTruthy();
      expect(gov.districts.length).toBeGreaterThan(0);
      expect(gov.landmarks.length).toBeGreaterThan(0);
      expect(gov.path.startsWith("M")).toBe(true);
      expect(gov.center[0]).toBeGreaterThan(0);
      expect(gov.center[0]).toBeLessThan(800);
      expect(gov.center[1]).toBeGreaterThan(0);
      expect(gov.center[1]).toBeLessThan(780);
    });
  });

  it("contains valid Tigris, Euphrates, and highway network paths", () => {
    expect(IRAQ_RIVERS.tigris.startsWith("M")).toBe(true);
    expect(IRAQ_RIVERS.euphrates.startsWith("M")).toBe(true);
    expect(IRAQ_RIVERS.shattAlArab.startsWith("M")).toBe(true);
    expect(IRAQ_HIGHWAYS.highway1.startsWith("M")).toBe(true);
    expect(IRAQ_HIGHWAYS.northHighway.startsWith("M")).toBe(true);
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
    const distBaghdadBasra = calculateDistanceKm(33.3152, 44.3661, 30.5081, 47.7835);
    expect(distBaghdadBasra).toBeGreaterThan(430);
    expect(distBaghdadBasra).toBeLessThan(480);

    const distSelf = calculateDistanceKm(33.3152, 44.3661, 33.3152, 44.3661);
    expect(distSelf).toBe(0);
  });

  it("contains both Google landmarks and community added spots", () => {
    const googleSpots = SEEDED_SPOTS.filter((s) => s.source === "google");
    const communitySpots = SEEDED_SPOTS.filter((s) => s.source === "community");

    expect(googleSpots.length).toBeGreaterThanOrEqual(10);
    expect(communitySpots.length).toBeGreaterThanOrEqual(10);

    SEEDED_SPOTS.forEach((spot) => {
      expect(spot.name).toBeTruthy();
      expect(spot.category).toBeTruthy();
      expect(spot.governorate).toBeTruthy();
      expect(spot.rating).toBeGreaterThanOrEqual(4.0);
      expect(spot.rating).toBeLessThanOrEqual(5.0);
      expect(spot.reviewsCount).toBeGreaterThan(0);
      expect(["google", "community"]).toContain(spot.source);
    });
  });
});
