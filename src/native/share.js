import { isNative } from './platform'

export async function shareText(title, text) {
  if (isNative()) {
    const { Share } = await import('@capacitor/share')
    await Share.share({ title, text, dialogTitle: title })
    return true
  }

  // Web fallback
  if (navigator.share) {
    await navigator.share({ title, text })
    return true
  }

  // Clipboard fallback
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return 'clipboard'
  }

  return false
}
