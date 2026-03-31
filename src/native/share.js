import { isNative } from './platform'

export async function copyTextToClipboard(text) {
  if (isNative()) {
    const { Clipboard } = await import('@capacitor/clipboard')
    await Clipboard.write({ string: text })
    return true
  }

  if (!navigator.clipboard) return false
  await navigator.clipboard.writeText(text)
  return true
}

export async function shareText(title, text, url = '') {
  if (isNative()) {
    const { Share } = await import('@capacitor/share')
    await Share.share({ title, text, url, dialogTitle: title })
    return { method: 'native-share' }
  }

  if (navigator.share) {
    const payload = { title, text }
    if (url) payload.url = url
    await navigator.share(payload)
    return { method: 'web-share' }
  }

  const copyContent = [text, url].filter(Boolean).join('\n').trim()
  const copied = await copyTextToClipboard(copyContent)
  return { method: copied ? 'clipboard' : 'unavailable' }
}
