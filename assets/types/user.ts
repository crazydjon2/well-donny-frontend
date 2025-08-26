export interface User {
  id: string
  tgId: number
  name: string
}

export type UserRoles = 'creator' | 'viewer'
