import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createStationDialogDisplayController } from './station-display.js'

function makeDialog(open = false) {
  const events = {}
  const el = {
    open,
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c) },
      remove(c) { this._classes.delete(c) },
      toggle(c, force) {
        if (force === undefined) {
          this._classes.has(c) ? this._classes.delete(c) : this._classes.add(c)
        } else {
          force ? this._classes.add(c) : this._classes.delete(c)
        }
      },
      contains(c) { return this._classes.has(c) },
    },
    addEventListener(type, handler, opts) {
      events[type] = handler
    },
    close() { this.open = false },
    _events: events,
  }
  return el
}

function makeElements(dialog) {
  const makeDummy = () => ({
    textContent: '',
    scrollWidth: 0,
    clientWidth: 100,
    classList: { toggle: vi.fn(), add: vi.fn(), remove: vi.fn(), contains: () => false },
    querySelector: () => null,
    setAttribute: vi.fn(),
    offsetWidth: 0,
    style: {},
    getBoundingClientRect: () => ({ height: 40 }),
    querySelectorAll: () => [],
  })

  return {
    dialog,
    dialogTitle: makeDummy(),
    dialogTitleTrack: makeDummy(),
    dialogTitleText: makeDummy(),
    dialogTitleTextClone: makeDummy(),
    dialogDisplay: makeDummy(),
    dialogDirectionTabs: [],
    arrivalsTitleNb: null,
    arrivalsTitleSb: null,
    arrivalsSectionNb: makeDummy(),
    arrivalsSectionSb: makeDummy(),
    arrivalsNb: { ...makeDummy(), style: { transform: '' } },
    arrivalsSb: { ...makeDummy(), style: { transform: '' } },
  }
}

function makeState() {
  return {
    dialogDisplayMode: false,
    dialogDisplayDirection: 'both',
    dialogDisplayAutoPhase: 'nb',
    dialogDisplayDirectionTimer: 0,
    dialogDisplayDirectionAnimationTimer: 0,
    dialogDisplayAnimatingDirection: '',
    dialogDisplayTimer: 0,
    dialogDisplayIndexes: { nb: 0, sb: 0 },
    dialogRefreshTimer: 0,
    currentDialogStation: null,
    activeDialogRequest: 0,
    currentDialogStationId: '',
  }
}

describe('createStationDialogDisplayController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('closeStationDialog', () => {
    it('increments activeDialogRequest and clears station state', () => {
      const dialog = makeDialog(false)
      const state = makeState()
      const { closeStationDialog } = createStationDialogDisplayController({
        state,
        elements: makeElements(dialog),
        copyValue: () => '',
        refreshStationDialog: vi.fn(),
        clearStationParam: vi.fn(),
      })

      state.currentDialogStation = { id: 'stop-1', name: 'Station' }
      state.currentDialogStationId = 'stop-1'
      closeStationDialog()

      expect(state.activeDialogRequest).toBe(1)
      expect(state.currentDialogStation).toBeNull()
      expect(state.currentDialogStationId).toBe('')
    })

    it('clears auto-refresh timer when dialog is closed', () => {
      const dialog = makeDialog(false)
      const state = makeState()
      const clearInterval = vi.spyOn(window, 'clearTimeout')

      const { closeStationDialog } = createStationDialogDisplayController({
        state,
        elements: makeElements(dialog),
        copyValue: () => '',
        refreshStationDialog: vi.fn(),
        clearStationParam: vi.fn(),
      })

      state.dialogRefreshTimer = 999
      closeStationDialog()

      expect(clearInterval).toHaveBeenCalledWith(999)
    })

    it('clears display scroll timer when dialog is closed', () => {
      const dialog = makeDialog(false)
      const state = makeState()
      const clearInterval = vi.spyOn(window, 'clearInterval')

      const { closeStationDialog } = createStationDialogDisplayController({
        state,
        elements: makeElements(dialog),
        copyValue: () => '',
        refreshStationDialog: vi.fn(),
        clearStationParam: vi.fn(),
      })

      state.dialogDisplayTimer = 888
      closeStationDialog()

      expect(clearInterval).toHaveBeenCalledWith(888)
    })
  })

  describe('cleanupDialogState', () => {
    it('stops all timers and resets display mode', () => {
      const dialog = makeDialog(false)
      const state = makeState()
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
      const clearStationParam = vi.fn()

      const { cleanupDialogState } = createStationDialogDisplayController({
        state,
        elements: makeElements(dialog),
        copyValue: () => '',
        refreshStationDialog: vi.fn(),
        clearStationParam,
      })

      state.dialogRefreshTimer = 100
      state.dialogDisplayTimer = 200
      state.dialogDisplayDirectionTimer = 300

      cleanupDialogState()

      expect(clearTimeoutSpy).toHaveBeenCalledWith(100)
      expect(clearIntervalSpy).toHaveBeenCalledWith(200)
      expect(clearIntervalSpy).toHaveBeenCalledWith(300)
      expect(state.dialogDisplayMode).toBe(false)
      expect(clearStationParam).toHaveBeenCalled()
    })
  })

  describe('activeDialogRequest concurrency guard', () => {
    it('increments on each close call preventing stale data from landing', () => {
      const dialog = makeDialog(false)
      const state = makeState()

      const { closeStationDialog } = createStationDialogDisplayController({
        state,
        elements: makeElements(dialog),
        copyValue: () => '',
        refreshStationDialog: vi.fn(),
        clearStationParam: vi.fn(),
      })

      closeStationDialog()
      closeStationDialog()

      expect(state.activeDialogRequest).toBe(2)
    })
  })

  describe('startDialogAutoRefresh', () => {
    it('schedules a refresh after the interval', async () => {
      const dialog = makeDialog(true)
      const state = makeState()
      const refreshStationDialog = vi.fn().mockResolvedValue(undefined)

      const { startDialogAutoRefresh, stopDialogAutoRefresh } = createStationDialogDisplayController({
        state,
        elements: makeElements(dialog),
        copyValue: () => '',
        refreshStationDialog,
        clearStationParam: vi.fn(),
      })

      state.currentDialogStation = { id: 'stop-1' }
      startDialogAutoRefresh()

      // Advance past the refresh interval once, then stop to avoid infinite loop
      await vi.advanceTimersByTimeAsync(100_000)
      stopDialogAutoRefresh()

      expect(refreshStationDialog).toHaveBeenCalled()
    })
  })
})
