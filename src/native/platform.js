export const isNative = () => !!window.Capacitor?.isNativePlatform?.()
export const isIOS = () => isNative() && window.Capacitor.getPlatform() === 'ios'
export const isWeb = () => !isNative()
