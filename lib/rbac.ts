import type { Role } from "@prisma/client"

// Define permissions for each role
export const PERMISSIONS = {
  // Super Admin - Full access
  SUPER_ADMIN: ["manage:all", "view:all", "create:institution", "delete:institution"],

  // institution Admin - Manage their institution
  ADMIN: [
    "manage:institution",
    "view:institution",
    "create:user",
    "edit:user",
    "delete:user",
    "create:class",
    "edit:class",
    "delete:class",
    "view:reports",
    "manage:finance",
  ],

  // Teacher - Manage classes and students
  TEACHER: ["view:class", "view:student", "edit:attendance", "edit:grade", "view:timetable", "send:message"],

  // Student - View own data
  STUDENT: ["view:own-profile", "view:own-grades", "view:own-attendance", "view:timetable", "send:message"],

  // Parent - View children's data
  PARENT: ["view:children", "view:children-grades", "view:children-attendance", "send:message", "view:invoice"],
}

export function hasPermission(userRole: Role, permission: string): boolean {
  const rolePermissions = PERMISSIONS[userRole] || []

  // Super admin has all permissions
  if (userRole === "SUPER_ADMIN") return true

  return rolePermissions.includes(permission)
}

export function canAccessRoute(userRole: Role, route: string): boolean {
  const routePermissions: Record<string, Role[]> = {
    "/dashboard": ["SUPER_ADMIN", "ADMIN", "TEACHER", "STUDENT", "PARENT"],
    "/dashboard/students": ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    "/dashboard/teachers": ["SUPER_ADMIN", "ADMIN"],
    "/dashboard/classes": ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    "/dashboard/attendance": ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    "/dashboard/finance": ["SUPER_ADMIN", "ADMIN"],
    "/dashboard/messages": ["SUPER_ADMIN", "ADMIN", "TEACHER", "STUDENT", "PARENT"],
    "/dashboard/settings": ["SUPER_ADMIN", "ADMIN"],
  }

  const allowedRoles = routePermissions[route]
  if (!allowedRoles) return true // Allow access if route not defined

  return allowedRoles.includes(userRole)
}
