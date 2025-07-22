import type { User } from './user'

export interface Category {
  id: string
  name: string
  user: User
  description: string
  createdAt: string
  updatedAt: string
}
