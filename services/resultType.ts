import type { Ref } from 'vue'

export interface ResultType<T> {
  data: Ref<T | null>
  status: Ref<'idle' | 'pending' | 'success' | 'error'>
  error: Ref<any>
  refresh?: any
}
