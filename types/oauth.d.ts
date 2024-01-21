export interface OAuthProviderConfig {
  oauth: {
    clientId: string
    clientSecret: string
  }

  name: string

  authorizeEndpoint: string
  tokenEndpoint: string
  scope: string

  options?: Record<string, string>
}
