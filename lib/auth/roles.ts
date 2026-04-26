import { UserRole } from "@prisma/client";

export const roleRank: Record<UserRole, number> = {
  VIEWER: 10,
  VOLUNTEER: 20,
  EDITOR: 30,
  MANAGER: 40,
  ADMIN: 50,
};

export const backofficeRoles = [UserRole.EDITOR, UserRole.MANAGER, UserRole.ADMIN] as const;
export const reportManagementRoles = [UserRole.MANAGER, UserRole.ADMIN] as const;

export function hasMinimumRole(role: UserRole, minimumRole: UserRole) {
  return roleRank[role] >= roleRank[minimumRole];
}

export function canAccessBackoffice(role: UserRole) {
  return role === UserRole.ADMIN;
}

export function canManageReports(role: UserRole) {
  return hasMinimumRole(role, UserRole.MANAGER);
}

export function getRoleLabel(role: UserRole) {
  switch (role) {
    case UserRole.VIEWER:
      return "Viewer";
    case UserRole.VOLUNTEER:
      return "Volunteer";
    case UserRole.EDITOR:
      return "Editor";
    case UserRole.MANAGER:
      return "Manager";
    case UserRole.ADMIN:
      return "Admin";
  }
}
