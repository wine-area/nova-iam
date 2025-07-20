import { request } from 'umi';

export interface RoleDto {
  id?: string;
  name: string;
  description?: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
  attributes: Record<string, string[]>;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  composite?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  composite?: boolean;
}

export interface RoleAssignmentDto {
  userId: string;
  username?: string;
  roles: RoleDto[];
}

export interface AssignRoleRequest {
  roleNames: string[];
}

// Realm Roles
export async function getRealmRoles(realmName: string): Promise<RoleDto[]> {
  return request(`/api/realms/${realmName}/roles/realm`, {
    method: 'GET',
  });
}

export async function createRealmRole(realmName: string, data: CreateRoleRequest): Promise<RoleDto> {
  return request(`/api/realms/${realmName}/roles/realm`, {
    method: 'POST',
    data,
  });
}

export async function updateRealmRole(
  realmName: string,
  roleName: string,
  data: UpdateRoleRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/realm/${roleName}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteRealmRole(realmName: string, roleName: string): Promise<void> {
  return request(`/api/realms/${realmName}/roles/realm/${roleName}`, {
    method: 'DELETE',
  });
}

// Client Roles
export async function getClientRoles(realmName: string, clientId: string): Promise<RoleDto[]> {
  return request(`/api/realms/${realmName}/roles/client/${clientId}`, {
    method: 'GET',
  });
}

export async function createClientRole(
  realmName: string,
  clientId: string,
  data: CreateRoleRequest,
): Promise<RoleDto> {
  return request(`/api/realms/${realmName}/roles/client/${clientId}`, {
    method: 'POST',
    data,
  });
}

export async function updateClientRole(
  realmName: string,
  clientId: string,
  roleName: string,
  data: UpdateRoleRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/client/${clientId}/${roleName}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteClientRole(
  realmName: string,
  clientId: string,
  roleName: string,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/client/${clientId}/${roleName}`, {
    method: 'DELETE',
  });
}

// User Role Assignments
export async function getUserRoles(realmName: string, userId: string): Promise<RoleAssignmentDto> {
  return request(`/api/realms/${realmName}/roles/user/${userId}`, {
    method: 'GET',
  });
}

export async function assignRealmRolesToUser(
  realmName: string,
  userId: string,
  data: AssignRoleRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/user/${userId}/realm`, {
    method: 'POST',
    data,
  });
}

export async function removeRealmRolesFromUser(
  realmName: string,
  userId: string,
  data: AssignRoleRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/user/${userId}/realm`, {
    method: 'DELETE',
    data,
  });
}

export async function assignClientRolesToUser(
  realmName: string,
  userId: string,
  clientId: string,
  data: AssignRoleRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/user/${userId}/client/${clientId}`, {
    method: 'POST',
    data,
  });
}

export async function removeClientRolesFromUser(
  realmName: string,
  userId: string,
  clientId: string,
  data: AssignRoleRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/roles/user/${userId}/client/${clientId}`, {
    method: 'DELETE',
    data,
  });
}