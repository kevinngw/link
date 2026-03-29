/**
 * useDialogDisplayMode.js
 * Manages the marquee-board display mode for the station dialog:
 *   - Scrolls arrival lists automatically at DIALOG_DISPLAY_SCROLL_INTERVAL_MS
 *   - Rotates between NB / SB directions at DIALOG_DISPLAY_DIRECTION_ROTATE_MS
 *     when direction is set to 'auto'
 *   - Provides toggleDisplayMode() to enter / exit display mode
 *
 * arrivalsNbRef / arrivalsSbRef — React refs to the arrivals-list DOM elements
 * that need to be translateY-animated for scrolling.
 *
 * Usage:
 *   const nbRef = useRef(null)
 *   const sbRef = useRef(null)
 *   const { isDisplayMode, toggleDisplayMode } = useDialogDisplayMode(nbRef, sbRef)
 */

import { useEffect, useRef, useCallback } from 'react'
import {
  DIALOG_DISPLAY_SCROLL_INTERVAL_MS,
  DIALOG_DISPLAY_DIRECTION_ROTATE_MS,
  DIALOG_DISPLAY_DIRECTION_ANIMATION_MS,
} from '../config'
import { useAppStore } from '../store/useAppStore'

export function useDialogDisplayMode(arrivalsNbRef, arrivalsSbRef) {
  const isDisplayMode = useAppStore((s) => s.dialogDisplayMode)
  const direction = useAppStore((s) => s.dialogDisplayDirection)
  const autoPhase = useAppStore((s) => s.dialogDisplayAutoPhase)
  const displayIndexes = useAppStore((s) => s.dialogDisplayIndexes)

  const {
    setDialogDisplayMode,
    setDialogDisplayDirection,
    setDialogDisplayAutoPhase,
    setDialogDisplayAnimatingDirection,
    updateDialogDisplayIndexes,
  } = useAppStore.getState()

  const scrollTimerRef = useRef(0)
  const directionTimerRef = useRef(0)
  const animationTimerRef = useRef(0)

  // ---------------------------------------------------------------------------
  // Scroll logic
  // ---------------------------------------------------------------------------

  const applyScrollOffset = useCallback(
    (nbIndex, sbIndex) => {
      const itemHeight = 56 // px — matches CSS --arrival-item-height
      if (arrivalsNbRef?.current) {
        arrivalsNbRef.current.style.transform = `translateY(-${nbIndex * itemHeight}px)`
      }
      if (arrivalsSbRef?.current) {
        arrivalsSbRef.current.style.transform = `translateY(-${sbIndex * itemHeight}px)`
      }
    },
    [arrivalsNbRef, arrivalsSbRef],
  )

  const advanceScrollIndexes = useCallback(() => {
    const nbItems = arrivalsNbRef?.current?.querySelectorAll('.arrival-item')?.length ?? 0
    const sbItems = arrivalsSbRef?.current?.querySelectorAll('.arrival-item')?.length ?? 0
    const currentNb = useAppStore.getState().dialogDisplayIndexes.nb
    const currentSb = useAppStore.getState().dialogDisplayIndexes.sb
    const nextNb = nbItems > 1 ? (currentNb + 1) % nbItems : 0
    const nextSb = sbItems > 1 ? (currentSb + 1) % sbItems : 0
    updateDialogDisplayIndexes({ nb: nextNb, sb: nextSb })
    applyScrollOffset(nextNb, nextSb)
  }, [arrivalsNbRef, arrivalsSbRef, updateDialogDisplayIndexes, applyScrollOffset])

  // ---------------------------------------------------------------------------
  // Direction rotation (auto mode)
  // ---------------------------------------------------------------------------

  const stopDirectionRotation = useCallback(() => {
    window.clearInterval(directionTimerRef.current)
    directionTimerRef.current = 0
  }, [])

  const startDirectionRotation = useCallback(() => {
    stopDirectionRotation()
    directionTimerRef.current = window.setInterval(() => {
      const currentPhase = useAppStore.getState().dialogDisplayAutoPhase
      const nextPhase = currentPhase === 'nb' ? 'sb' : 'nb'
      setDialogDisplayAutoPhase(nextPhase)
      setDialogDisplayAnimatingDirection(nextPhase)

      // Clear animation class after animation duration
      window.clearTimeout(animationTimerRef.current)
      animationTimerRef.current = window.setTimeout(() => {
        setDialogDisplayAnimatingDirection('')
      }, DIALOG_DISPLAY_DIRECTION_ANIMATION_MS)
    }, DIALOG_DISPLAY_DIRECTION_ROTATE_MS)
  }, [stopDirectionRotation, setDialogDisplayAutoPhase, setDialogDisplayAnimatingDirection])

  // ---------------------------------------------------------------------------
  // Scroll timer
  // ---------------------------------------------------------------------------

  const stopScrollTimer = useCallback(() => {
    window.clearInterval(scrollTimerRef.current)
    scrollTimerRef.current = 0
  }, [])

  const startScrollTimer = useCallback(() => {
    stopScrollTimer()
    scrollTimerRef.current = window.setInterval(() => {
      advanceScrollIndexes()
    }, DIALOG_DISPLAY_SCROLL_INTERVAL_MS)
  }, [stopScrollTimer, advanceScrollIndexes])

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Start / stop scroll + direction rotation based on display mode
  useEffect(() => {
    if (isDisplayMode) {
      // Reset indexes
      updateDialogDisplayIndexes({ nb: 0, sb: 0 })
      applyScrollOffset(0, 0)
      startScrollTimer()

      if (direction === 'auto') {
        setDialogDisplayAutoPhase('nb')
        startDirectionRotation()
      }
    } else {
      stopScrollTimer()
      stopDirectionRotation()
      window.clearTimeout(animationTimerRef.current)
      setDialogDisplayAnimatingDirection('')
      // Reset scroll
      applyScrollOffset(0, 0)
      updateDialogDisplayIndexes({ nb: 0, sb: 0 })
    }

    return () => {
      stopScrollTimer()
      stopDirectionRotation()
      window.clearTimeout(animationTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisplayMode, direction])

  // Sync scroll offset when indexes change externally
  useEffect(() => {
    applyScrollOffset(displayIndexes.nb, displayIndexes.sb)
  }, [displayIndexes, applyScrollOffset])

  // ---------------------------------------------------------------------------
  // Toggle
  // ---------------------------------------------------------------------------

  const toggleDisplayMode = useCallback(() => {
    setDialogDisplayMode(!isDisplayMode)
  }, [isDisplayMode, setDialogDisplayMode])

  return { isDisplayMode, toggleDisplayMode }
}
