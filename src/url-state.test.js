import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getActiveLineFromUrl, getPageFromUrl, setActiveLineParam, setPageParam } from './url-state'

function setLocation(path) {
  window.history.replaceState({}, '', path)
}

describe('url-state page params', () => {
  beforeEach(() => {
    setLocation('/link/')
    vi.spyOn(window.history, 'pushState')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads favorites as a routable page', () => {
    setLocation('/link/?page=favorites')

    expect(getPageFromUrl()).toBe('favorites')
  })

  it('writes favorites page params without coercing back to map', () => {
    setPageParam('favorites')

    expect(window.location.search).toBe('?page=favorites')
  })

  it('keeps map as the clean default URL', () => {
    setLocation('/link/?page=favorites')

    setPageParam('map')

    expect(window.location.search).toBe('')
  })

  it('falls back to map for unknown pages', () => {
    setLocation('/link/?page=settings')

    expect(getPageFromUrl()).toBe('map')
  })

  it('reads active route params for shareable line selection', () => {
    setLocation('/link/?system=rapidride&route=e-line')

    expect(getActiveLineFromUrl()).toBe('e-line')
  })

  it('writes active route params when a non-default line is selected', () => {
    setActiveLineParam('e-line', 'a-line')

    expect(window.location.search).toBe('?route=e-line')
  })

  it('keeps the default line as a clean URL', () => {
    setLocation('/link/?route=e-line')

    setActiveLineParam('a-line', 'a-line')

    expect(window.location.search).toBe('')
  })
})
