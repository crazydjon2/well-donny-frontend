import type { SupportedLanguage } from './ui'

export interface User {
  id: string
  tgId: number
  name: string
  language: SupportedLanguage
  isPublic: boolean
  allowNotification: boolean
}

export interface UserProfile extends User {
  totalCompletionСount: number
  strick: number
}

export type UserRoles = 'creator' | 'viewer'

export interface EditProfileDTO {
  language: SupportedLanguage
  isPublic: boolean
  allowNotification: boolean
}
