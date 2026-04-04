import { describe, expect, it } from 'vitest'
import { renderAppShell } from './app-shell.js'

describe('renderAppShell', () => {
  it('renders Chinese labels for the station dialog direction tabs', () => {
    document.body.innerHTML = '<div id="root"></div>'
    const root = document.querySelector('#root')

    renderAppShell(root)

    expect(root.querySelector('[data-dialog-direction="nb"]')?.textContent).toBe('上行')
    expect(root.querySelector('[data-dialog-direction="sb"]')?.textContent).toBe('下行')
  })
})
