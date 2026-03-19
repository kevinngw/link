import { describe, it, expect } from 'vitest'
import {
  classifyArrivalDirection,
  getLineRouteId,
  formatArrivalDestination,
  getArrivalServiceStatus,
  getStatusTone,
} from './arrivals.js'

describe('arrivals', () => {
  describe('classifyArrivalDirection', () => {
    it('classifies from directionLookup', () => {
      const line = {
        directionLookup: { 'trip1': '1' }
      }
      const arrival = { tripId: 'trip1' }
      
      expect(classifyArrivalDirection(arrival, line)).toBe('nb')
    })
    
    it('classifies from headsign (Lynnwood)', () => {
      const line = {}
      const arrival = { tripHeadsign: 'to Lynnwood City Center' }
      
      expect(classifyArrivalDirection(arrival, line)).toBe('nb')
    })
    
    it('classifies from headsign (Federal Way)', () => {
      const line = {}
      const arrival = { tripHeadsign: 'to Federal Way' }
      
      expect(classifyArrivalDirection(arrival, line)).toBe('sb')
    })
    
    it('returns empty for unknown', () => {
      const line = {}
      const arrival = { tripHeadsign: 'Unknown' }
      
      expect(classifyArrivalDirection(arrival, line)).toBe('')
    })
  })

  describe('getLineRouteId', () => {
    it('returns routeKey if present', () => {
      const line = { routeKey: '40_100479', agencyId: '40', id: '100479' }
      expect(getLineRouteId(line)).toBe('40_100479')
    })
    
    it('constructs from agency and id', () => {
      const line = { agencyId: '40', id: '100479' }
      expect(getLineRouteId(line)).toBe('40_100479')
    })
  })

  describe('formatArrivalDestination', () => {
    it('removes "to " prefix', () => {
      const arrival = { tripHeadsign: 'to Lynnwood' }
      const copyValue = (key) => key
      
      expect(formatArrivalDestination(arrival, copyValue)).toBe('Lynnwood')
    })
    
    it('trims whitespace', () => {
      const arrival = { tripHeadsign: '  Lynnwood  ' }
      const copyValue = (key) => key
      
      expect(formatArrivalDestination(arrival, copyValue)).toBe('Lynnwood')
    })
    
    it('uses fallback for empty headsign', () => {
      const arrival = { tripHeadsign: '' }
      const copyValue = (key) => 'Terminal'
      
      expect(formatArrivalDestination(arrival, copyValue)).toBe('Terminal')
    })
  })

  describe('getArrivalServiceStatus', () => {
    const mockCopyValue = (key) => ({ onTimeStatus: 'ON TIME' })[key] ?? key

    it('returns ARR for imminent arrival', () => {
      const arrivalTime = Date.now() + 30000 // 30 seconds
      expect(getArrivalServiceStatus(arrivalTime, 0, mockCopyValue)).toBe('ARR')
    })

    it('returns DELAY for late arrival', () => {
      const arrivalTime = Date.now() + 300000 // 5 minutes
      expect(getArrivalServiceStatus(arrivalTime, 180, mockCopyValue)).toBe('DELAY')
    })

    it('returns ON TIME for normal arrival', () => {
      const arrivalTime = Date.now() + 300000
      expect(getArrivalServiceStatus(arrivalTime, 0, mockCopyValue)).toBe('ON TIME')
    })
  })

  describe('getStatusTone', () => {
    it('returns delay tone for DELAY', () => {
      expect(getStatusTone('DELAY')).toBe('delay')
    })
    
    it('returns arr tone for ARR', () => {
      expect(getStatusTone('ARR')).toBe('arr')
    })
    
    it('returns ok tone for others', () => {
      expect(getStatusTone('ON TIME')).toBe('ok')
      expect(getStatusTone('')).toBe('ok')
    })
  })
})
