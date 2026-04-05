import { IS_NATIVE_BUILD, isNativePlatform } from './platform'

let clipboardPlugin = null
let sharePlugin = null

const loadClipboardPlugin = IS_NATIVE_BUILD
  ? async function loadClipboardPluginNative() {
      if (!clipboardPlugin) {
        const mod = await import('@capacitor/clipboard')
        clipboardPlugin = mod.Clipboard
      }
      return clipboardPlugin
    }
  : async function loadClipboardPluginWeb() {
      return null
    }

const loadSharePlugin = IS_NATIVE_BUILD
  ? async function loadSharePluginNative() {
      if (!sharePlugin) {
        const mod = await import('@capacitor/share')
        sharePlugin = mod.Share
      }
      return sharePlugin
    }
  : async function loadSharePluginWeb() {
      return null
    }

export async function copyTextToClipboard(text) {
  if (isNativePlatform()) {
    const Clipboard = await loadClipboardPlugin()
    if (!Clipboard) return false
    await Clipboard.write({ string: text })
    return true
  }

  if (!navigator.clipboard) return false
  await navigator.clipboard.writeText(text)
  return true
}

export async function shareTextContent({ title = '', text = '', url = '' }) {
  if (isNativePlatform()) {
    const Share = await loadSharePlugin()
    if (!Share) return { method: 'unavailable' }
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
