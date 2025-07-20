import { request } from 'umi';

export interface ClientDto {
  id?: string;
  clientId: string;
  name?: string;
  description?: string;
  enabled: boolean;
  clientAuthenticatorType?: string;
  secret?: string;
  redirectUris: string[];
  webOrigins: string[];
  bearerOnly: boolean;
  consentRequired: boolean;
  standardFlowEnabled: boolean;
  implicitFlowEnabled: boolean;
  directAccessGrantsEnabled: boolean;
  serviceAccountsEnabled: boolean;
  publicClient: boolean;
  frontchannelLogout: boolean;
  protocol: string;
  attributes: Record<string, string>;
  fullScopeAllowed: boolean;
  nodeReRegistrationTimeout: number;
  defaultClientScopes: string[];
  optionalClientScopes: string[];
}

export interface CreateClientRequest {
  clientId: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  redirectUris?: string[];
  webOrigins?: string[];
  publicClient?: boolean;
  standardFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  serviceAccountsEnabled?: boolean;
}

export interface UpdateClientRequest {
  name?: string;
  description?: string;
  enabled?: boolean;
  redirectUris?: string[];
  webOrigins?: string[];
  publicClient?: boolean;
  standardFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  serviceAccountsEnabled?: boolean;
}

export async function getAllClients(realmName: string): Promise<ClientDto[]> {
  return request(`/api/realms/${realmName}/clients`, {
    method: 'GET',
  });
}

export async function getClient(realmName: string, clientId: string): Promise<ClientDto> {
  return request(`/api/realms/${realmName}/clients/${clientId}`, {
    method: 'GET',
  });
}

export async function createClient(realmName: string, data: CreateClientRequest): Promise<ClientDto> {
  return request(`/api/realms/${realmName}/clients`, {
    method: 'POST',
    data,
  });
}

export async function updateClient(
  realmName: string,
  clientId: string,
  data: UpdateClientRequest,
): Promise<void> {
  return request(`/api/realms/${realmName}/clients/${clientId}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteClient(realmName: string, clientId: string): Promise<void> {
  return request(`/api/realms/${realmName}/clients/${clientId}`, {
    method: 'DELETE',
  });
}

export async function regenerateClientSecret(
  realmName: string,
  clientId: string,
): Promise<{ secret: string }> {
  return request(`/api/realms/${realmName}/clients/${clientId}/regenerate-secret`, {
    method: 'POST',
  });
}