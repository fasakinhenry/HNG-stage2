export interface AccountUser {
  id: string
  name: string
  email: string
  avatarUrl: string
}

export interface AuthResponse {
  token: string
  user: AccountUser
}
