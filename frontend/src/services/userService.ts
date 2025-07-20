import { request } from '@umijs/max';

export interface UserDto {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  attributes?: Record<string, string[]>;
}

export interface CreateUserRequest {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  enabled: boolean;
}

export async function getUsers(realmName: string): Promise<UserDto[]> {
  return request(`/api/realms/${realmName}/users`, {
    method: 'GET',
  });
}

export async function getUser(realmName: string, userId: string): Promise<UserDto> {
  return request(`/api/realms/${realmName}/users/${userId}`, {
    method: 'GET',
  });
}

export async function createUser(
  realmName: string,
  user: CreateUserRequest,
): Promise<UserDto> {
  return request(`/api/realms/${realmName}/users`, {
    method: 'POST',
    data: user,
  });
}