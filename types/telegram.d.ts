export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData?: string
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
            language_code?: string
          }
          [key: string]: any
        }
        ready: () => void
        expand: () => void
        close: () => void
        MainButton: {
          show: () => void
          hide: () => void
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        setHeaderColor?: (color: string) => void
        setBackgroundColor?: (color: string) => void
        [key: string]: any
      }
      WebView: {
        isIframe: boolean
      }
    }
  }
}
