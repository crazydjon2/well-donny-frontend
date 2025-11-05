import type { CategoryType } from './categoriesTypes'
import type { User, UserRoles } from './user'
import type { CreateWordDTO, EditWordDTO } from './word'

export interface Category {
  id: string
  name: string
  users: (User & { role: UserRoles, rate: number, completionСount: number })[]
  description: string
  // TODO ADD ENUM!!!!!!!!!!!
  type: CategoryType & { parent?: CategoryType }
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDTO {
  name: string
  description?: string
  type: string
  words: CreateWordDTO[]
}

export interface EditCategoryDTO {
  id: string
  name: string
  description?: string
  type: string
  words: EditWordDTO[]
}
