import { request } from '@umijs/max';

export interface RealmDto {
  id?: string;
  realm: string;
  displayName?: string;
  enabled: boolean;
  loginTheme?: string;
  accountTheme?: string;
  adminTheme?: string;
  emailTheme?: string;
}

export async function getAllRealms(): Promise<RealmDto[]> {
  return request('/api/realms', {
    method: 'GET',
  });
}

export async function getRealm(realmName: string): Promise<RealmDto> {
  return request(`/api/realms/${realmName}`, {
    method: 'GET',
  });
}

export async function createRealm(realm: RealmDto): Promise<RealmDto> {
  return request('/api/realms', {
    method: 'POST',
    data: realm,
  });
}