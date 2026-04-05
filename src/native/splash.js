import { IS_NATIVE_BUILD, isNativePlatform } from './platform'

const hideNativeSplashScreen = IS_NATIVE_BUILD
  ? async function hideNativeSplashScreen() {
      const { SplashScreen } = await import('@capacitor/splash-screen')
      await SplashScreen.hide({ fadeOutDuration: 300 })
      return true
    }
  : async function hideNativeSplashScreenWeb() {
      return false
    }

export async function hideSplashScreen() {
  if (!isNativePlatform()) return false

  try {
    return await hideNativeSplashScreen()
  } catch {
    return false
  }
}
