export const SocialAuth = {
    Google: "Google",
    GitHub: "GitHub"
} as const;
export type SocialAuth = (typeof SocialAuth)[keyof typeof SocialAuth];
