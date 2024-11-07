import type { SocialAuth } from '~~/kysely/db/types';

export type OAuthProvider = SocialAuth;

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
