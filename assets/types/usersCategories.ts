import type { Category } from './category'
import type { User } from './user'

export interface UsersCategory {
  id: string
  role: 'creator' | 'viewer'
  user: User
  category: Category
}

export interface CategoryFolder {
  name: string
  value: number | string
  custom: boolean
}

export interface UserCategory {
  id: string
  role: 'creator' | 'viewer'
  completionСount:number,
  rate: number,
  reverseOrder: boolean
}
