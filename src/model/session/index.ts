export interface SessionModel {
  user: User
  expires: string
  id: string
  email: string
  name: string
  accessToken: string
  refreshToke: string
}

export interface User {
  name: string
  email: string
}
