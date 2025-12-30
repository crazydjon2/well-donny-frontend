import type { Category } from './category'
import type { User } from './user'

export interface UsersCategory {
  id: string
  role: 'creator' | 'viewer'
  avgRate: number
  author: User
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
  completionСount: number
  rate: number
  reverseOrder: boolean
  cardPosition: number
}
