import { matchPath } from "react-router-dom";

export const RoleId = {
  Cliente: 1,
  Trabajador: 2,
  Admin: 3,
} as const;

export type RoleId = (typeof RoleId)[keyof typeof RoleId];

export const routePermissions: Array<{
  path: string;
  roles: RoleId[];
}> = [
  // Cliente autenticado
  { path: "/cart", roles: [RoleId.Cliente, RoleId.Admin] },
  { path: "/checkout", roles: [RoleId.Cliente, RoleId.Admin] },
  { path: "/orders", roles: [RoleId.Cliente, RoleId.Admin] },
  { path: "/orders/:id", roles: [RoleId.Cliente, RoleId.Admin] },

  // Trabajador
  { path: "/worker/orders", roles: [RoleId.Trabajador, RoleId.Admin] },
  { path: "/worker/orders/:id", roles: [RoleId.Trabajador, RoleId.Admin] },

  // Admin
  { path: "/admin", roles: [RoleId.Admin] },
  { path: "/admin/users", roles: [RoleId.Admin] },
  { path: "/admin/products", roles: [RoleId.Admin] },
  { path: "/admin/categories", roles: [RoleId.Admin] },
  { path: "/admin/orders", roles: [RoleId.Admin] },
];

export function getAllowedRolesForPath(pathname: string) {
  const match = routePermissions.find(({ path }) =>
    matchPath({ path, end: true }, pathname)
  );

  return match?.roles;
}

export function canAccessRoute(pathname: string, rolId: number) {
  const roles = getAllowedRolesForPath(pathname);

  if (!roles) return true;

  return roles.some((role) => role === rolId);
}
