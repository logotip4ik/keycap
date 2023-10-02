export interface GitHubAuthRes {
  access_token: string
  scope: string
  token_type: string
}

export interface GitHubUserRes {
  id: number
  login: string
  name: string
  email: string
}

export interface GitHubUserEmailRes {
  email: string
  primary: boolean
  verified: boolean
  visibility: string
}
