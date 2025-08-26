import type { Category } from './category'
import type { User } from './user'

export interface UsersCategory {
  id: string
  role: 'creator' | 'viewer'
  user: User
  category: Category
}
