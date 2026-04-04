import { describe, it, expect } from 'vitest'
import {
  classifyArrivalDirection,
  createArrivalsHelpers,
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

  describe('buildArrivalsForLine', () => {
    it('filters out scheduled-only arrivals', () => {
      const state = { arrivalsCache: new Map(), activeSystemId: 'link' }
      const copyValue = (key) => ({ terminalFallback: 'Terminal' })[key] ?? key
      const { buildArrivalsForLine } = createArrivalsHelpers({
        state,
        fetchJsonWithRetry: async () => ({}),
        getStationStopIds: () => [],
        copyValue,
      })

      const now = Date.now()
      const line = {
        id: '100479',
        agencyId: '40',
        routeKey: '40_100479',
        directionLookup: { trip1: '1', trip2: '1' },
        color: '#28813F',
        name: '1 Line',
      }

      const arrivals = buildArrivalsForLine([
        {
          tripId: 'trip1',
          routeId: '40_100479',
          stopId: '40_N23-T1',
          predictedArrivalTime: now + 5 * 60 * 1000,
          scheduledArrivalTime: now + 5 * 60 * 1000,
          tripHeadsign: 'Lynnwood City Center',
          vehicleId: '1_100',
          scheduleDeviation: 0,
        },
        {
          tripId: 'trip2',
          routeId: '40_100479',
          stopId: '40_N23-T1',
          scheduledArrivalTime: now + 10 * 60 * 1000,
          tripHeadsign: 'Lynnwood City Center',
          vehicleId: '1_200',
          scheduleDeviation: 0,
        },
      ], line)

      expect(arrivals.nb).toHaveLength(1)
      expect(arrivals.nb[0].vehicleId).toBe('100')
      expect(arrivals.nb[0].isRealtime).toBe(true)
    })
  })
})
