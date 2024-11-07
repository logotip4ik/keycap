export interface GoogleAuthRes {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
  id_token: string
}

export interface GoogleUserRes {
  id: string
  email: string
  verified_email: boolean
  picture: string
}
