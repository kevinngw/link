import { isNative } from './platform'

export async function hideSplashScreen() {
  if (!isNative()) return
  const { SplashScreen } = await import('@capacitor/splash-screen')
  await SplashScreen.hide({ fadeOutDuration: 300 })
}
