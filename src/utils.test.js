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
    it('formats meters', () => {
      expect(formatDistanceMeters(500)).toBe('500 m')
    })
    
    it('formats kilometers', () => {
      expect(formatDistanceMeters(1500)).toBe('1.5 km')
    })
    
    it('handles zero', () => {
      expect(formatDistanceMeters(0)).toBe('0 m')
    })
  })

  describe('normalizeName', () => {
    it('trims whitespace', () => {
      expect(normalizeName('  Station Name  ')).toBe('Station Name')
    })
    
    it('replaces multiple spaces', () => {
      expect(normalizeName('Station    Name')).toBe('Station Name')
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
    
    it('handles invalid input', () => {
      expect(parseClockToSeconds('invalid')).toBe(0)
    })
  })

  describe('pluralizeVehicleLabel', () => {
    it('returns singular for 1', () => {
      expect(pluralizeVehicleLabel(1, 'Train', 'Trains')).toBe('Train')
    })
    
    it('returns plural for 0', () => {
      expect(pluralizeVehicleLabel(0, 'Train', 'Trains')).toBe('Trains')
    })
    
    it('returns plural for >1', () => {
      expect(pluralizeVehicleLabel(5, 'Train', 'Trains')).toBe('Trains')
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
    
    it('handles special characters', () => {
      expect(slugifyStation('Station & Stop')).toBe('station-stop')
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
