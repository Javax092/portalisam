import { UserRole } from "@prisma/client";

export const roleRank: Record<UserRole, number> = {
  ADMIN: 50,
  ASSISTANT: 40,
};

export const backofficeRoles = [UserRole.ASSISTANT, UserRole.ADMIN] as const;
export const reportManagementRoles = [UserRole.ASSISTANT, UserRole.ADMIN] as const;

export function hasMinimumRole(role: UserRole, minimumRole: UserRole) {
  return roleRank[role] >= roleRank[minimumRole];
}

export function canAccessBackoffice(role: UserRole) {
  return backofficeRoles.includes(role);
}

export function canManageReports(role: UserRole) {
  return hasMinimumRole(role, UserRole.ASSISTANT);
}

export function canManageSensitiveSettings(role: UserRole) {
  return role === UserRole.ADMIN;
}

export function getRoleLabel(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "Admin";
    case UserRole.ASSISTANT:
      return "Assistente";
  }
}
