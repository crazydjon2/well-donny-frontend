import { computed, reactive, toRefs } from 'vue'

// composables/useTelegramAuth.ts
export interface TelegramUser {
  id: number
  first_name?: string | undefined
  last_name?: string | undefined
  username?: string | undefined
  language_code?: string | undefined
}

interface TelegramAuthState {
  isReady: boolean
  user: TelegramUser | null
  initData: string | null
  initDataUnsafe: any
  platform: string
}

export function useTelegramAuth() {
  const state = reactive<TelegramAuthState>({
    isReady: false,
    user: null,
    initData: null,
    initDataUnsafe: null,
    platform: 'unknown',
  })

  // Обновление состояния из Telegram WebApp
  const updateTelegramState = () => {
    if (window.Telegram?.WebApp) {
      state.user = window.Telegram.WebApp.initDataUnsafe?.user || null
      state.initData = window.Telegram.WebApp.initData || null
      state.initDataUnsafe = window.Telegram.WebApp.initDataUnsafe || null
      state.platform = window.Telegram.WebApp.platform || 'unknown'
      state.isReady = true
    }
  }

  // Ожидание инициализации Telegram WebApp
  const waitForTelegramInit = async (timeout: number = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
      // Если Telegram уже инициализирован
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        updateTelegramState()
        resolve(true)
        return
      }

      const startTime = Date.now()

      const checkInterval = setInterval(() => {
        if (!window.Telegram?.WebView.isIframe) {
          clearInterval(checkInterval)
          resolve(false)
        }
        // Проверяем наличие Telegram WebApp
        if (window.Telegram?.WebApp) {
          // Пытаемся вызвать ready() если доступно
          if (typeof window.Telegram.WebApp.ready === 'function') {
            try {
              window.Telegram.WebApp.ready()
            }
            catch (e) {
              console.warn('Telegram WebApp.ready() failed:', e)
            }
          }

          // Даём время на инициализацию после ready()
          setTimeout(() => {
            if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
              clearInterval(checkInterval)
              updateTelegramState()
              resolve(true)
            }
          }, 100)
        }

        // Таймаут
        if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval)
          console.warn(`Telegram initialization timeout after ${timeout}ms`)
          resolve(false)
        }
      }, 50)
    })
  }

  // Получение Telegram User ID с fallback'ами
  const getTelegramUserId = (): string | null => {
    if (state.user?.id) {
      return state.user.id.toString()
    }

    // Fallback: из localStorage
    const tgIdFromStorage = localStorage.getItem('tgId')
    if (tgIdFromStorage) {
      return tgIdFromStorage
    }

    return null
  }

  // Получение имени пользователя
  const getTelegramUsername = (): string => {
    if (state.user?.username) {
      return state.user.username
    }

    if (state.user?.first_name) {
      return state.user.first_name
    }

    // Генерация случайного имени как fallback
    return `user_${Math.random().toString(36).substring(2, 8)}`
  }

  // Инициализация
  // composables/useTelegramAuth.ts
  const init = async (timeout = 5000): Promise<boolean> => {
    // Если уже готов — ок
    if (state.isReady && state.user?.id) {
      return true
    }

    // Если явно не в Telegram окружении — сразу false
    if (!window.Telegram?.WebApp) {
      console.warn('Telegram WebApp не найден в window')
      return false
    }

    return await waitForTelegramInit(timeout)
  }

  // Проверка, запущено ли в Telegram
  const isTelegramWebView = computed(() => {
    return state.platform !== 'unknown' && state.platform !== 'web'
  })

  return {
    // State
    ...toRefs(state),

    // Methods
    init,
    waitForTelegramInit,
    getTelegramUserId,
    getTelegramUsername,
    updateTelegramState,
    isTelegramWebView,
  }
}
