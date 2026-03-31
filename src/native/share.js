import { Clipboard } from '@capacitor/clipboard'
import { Share } from '@capacitor/share'

import { isNativePlatform } from './platform'

export async function copyTextToClipboard(text) {
  if (isNativePlatform()) {
    await Clipboard.write({ string: text })
    return true
  }

  if (!navigator.clipboard) return false
  await navigator.clipboard.writeText(text)
  return true
}

export async function shareTextContent({ title = '', text = '', url = '' }) {
  if (isNativePlatform()) {
    await Share.share({ title, text, url })
    return { method: 'native-share' }
  }

  if (navigator.share) {
    await navigator.share({ title, text, url })
    return { method: 'web-share' }
  }

  const copied = await copyTextToClipboard([text, url].filter(Boolean).join('\n').trim())
  return { method: copied ? 'clipboard' : 'unavailable' }
}
