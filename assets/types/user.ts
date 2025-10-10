export interface User {
  id: string
  tgId: number
  name: string
}

export interface UserProfile extends User {
  totalCompletionСount: number
  strick: number
}

export type UserRoles = 'creator' | 'viewer'
