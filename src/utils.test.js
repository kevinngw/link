import { describe, it, expect } from 'vitest'
import {
  clamp,
  formatDistanceMeters,
  getDistanceMeters,
  normalizeName,
  parseClockToSeconds,
  pluralizeVehicleLabel,
  sleep,
  slugifyStation,
} from './utils.js'

describe('utils', () => {
  describe('clamp', () => {
    it('returns value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
    })

    it('clamps to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
    })

    it('clamps to max', () => {
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('formatDistanceMeters', () => {
    it('formats feet for short distances', () => {
      expect(formatDistanceMeters(30)).toBe('98 ft')
    })

    it('formats miles for longer distances', () => {
      expect(formatDistanceMeters(1500)).toBe('0.9 mi')
    })

    it('handles zero', () => {
      expect(formatDistanceMeters(0)).toBe('0 ft')
    })

    it('handles non-finite input', () => {
      expect(formatDistanceMeters(NaN)).toBe('')
    })
  })

  describe('normalizeName', () => {
    it('removes Station from name', () => {
      expect(normalizeName('University Station')).toBe('University')
    })

    it('abbreviates Univ of Washington', () => {
      expect(normalizeName('Univ of Washington')).toBe('UW')
    })

    it('handles empty string', () => {
      expect(normalizeName('')).toBe('')
    })
  })

  describe('parseClockToSeconds', () => {
    it('parses HH:MM:SS', () => {
      expect(parseClockToSeconds('10:30:00')).toBe(10 * 3600 + 30 * 60)
    })

    it('parses HH:MM', () => {
      expect(parseClockToSeconds('10:30')).toBe(10 * 3600 + 30 * 60)
    })

    it('returns NaN for invalid input', () => {
      expect(parseClockToSeconds('invalid')).toBeNaN()
    })
  })

  describe('pluralizeVehicleLabel', () => {
    it('adds s to regular label', () => {
      expect(pluralizeVehicleLabel('train')).toBe('trains')
    })

    it('adds es to bus', () => {
      expect(pluralizeVehicleLabel('bus')).toBe('buses')
    })

    it('adds es to Bus (case-insensitive)', () => {
      expect(pluralizeVehicleLabel('Bus')).toBe('Buses')
    })
  })

  describe('sleep', () => {
    it('resolves after delay', async () => {
      const start = Date.now()
      await sleep(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(45)
    })
  })

  describe('slugifyStation', () => {
    it('converts to lowercase', () => {
      expect(slugifyStation('Station Name')).toBe('station-name')
    })

    it('replaces spaces with hyphens', () => {
      expect(slugifyStation('Sea Tac Airport')).toBe('sea-tac-airport')
    })

    it('converts & to and', () => {
      expect(slugifyStation('Station & Stop')).toBe('station-and-stop')
    })

    it('removes apostrophes and dots', () => {
      expect(slugifyStation("Int'l Dist.")).toBe('intl-dist')
    })
  })

  describe('getDistanceMeters', () => {
    it('calculates distance between two points', () => {
      // Seattle to Bellevue approximate
      const seattle = { lat: 47.6062, lon: -122.3321 }
      const bellevue = { lat: 47.6101, lon: -122.2015 }

      const distance = getDistanceMeters(seattle.lat, seattle.lon, bellevue.lat, bellevue.lon)

      // Should be around 10km
      expect(distance).toBeGreaterThan(9000)
      expect(distance).toBeLessThan(11000)
    })

    it('returns 0 for same point', () => {
      expect(getDistanceMeters(47.6, -122.3, 47.6, -122.3)).toBe(0)
    })
  })
})
