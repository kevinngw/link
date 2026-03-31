import { isNativePlatform } from './platform'

export async function hideSplashScreen() {
  if (!isNativePlatform()) return false

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide({ fadeOutDuration: 300 })
    return true
  } catch {
    return false
  }
}
