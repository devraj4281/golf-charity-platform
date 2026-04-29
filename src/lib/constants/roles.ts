export const ROLES = {
  ADMIN: 'admin',
  SUBSCRIBER: 'subscriber',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
