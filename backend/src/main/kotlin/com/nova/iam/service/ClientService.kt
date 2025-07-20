package com.nova.iam.service

import com.nova.iam.dto.ClientDto
import com.nova.iam.dto.CreateClientRequest
import com.nova.iam.dto.UpdateClientRequest
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.ClientRepresentation
import org.springframework.stereotype.Service
import jakarta.ws.rs.core.Response

@Service
class ClientService(private val keycloak: Keycloak) {

    fun getAllClients(realmName: String): List<ClientDto> {
        val realm = keycloak.realm(realmName)
        val clients = realm.clients().findAll()
        
        return clients.map { client ->
            ClientDto(
                id = client.id,
                clientId = client.clientId,
                name = client.name,
                description = client.description,
                enabled = client.isEnabled ?: true,
                clientAuthenticatorType = client.clientAuthenticatorType ?: "client-secret",
                secret = client.secret,
                redirectUris = client.redirectUris ?: emptyList(),
                webOrigins = client.webOrigins ?: emptyList(),
                bearerOnly = client.isBearerOnly ?: false,
                consentRequired = client.isConsentRequired ?: false,
                standardFlowEnabled = client.isStandardFlowEnabled ?: true,
                implicitFlowEnabled = client.isImplicitFlowEnabled ?: false,
                directAccessGrantsEnabled = client.isDirectAccessGrantsEnabled ?: true,
                serviceAccountsEnabled = client.isServiceAccountsEnabled ?: false,
                publicClient = client.isPublicClient ?: false,
                frontchannelLogout = client.isFrontchannelLogout ?: false,
                protocol = client.protocol ?: "openid-connect",
                attributes = client.attributes ?: emptyMap(),
                fullScopeAllowed = client.isFullScopeAllowed ?: true,
                nodeReRegistrationTimeout = client.nodeReRegistrationTimeout ?: -1,
                defaultClientScopes = client.defaultClientScopes ?: emptyList(),
                optionalClientScopes = client.optionalClientScopes ?: emptyList()
            )
        }
    }

    fun getClient(realmName: String, clientId: String): ClientDto? {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                null
            } else {
                val client = clients[0]
                ClientDto(
                    id = client.id,
                    clientId = client.clientId,
                    name = client.name,
                    description = client.description,
                    enabled = client.isEnabled ?: true,
                    clientAuthenticatorType = client.clientAuthenticatorType ?: "client-secret",
                    secret = client.secret,
                    redirectUris = client.redirectUris ?: emptyList(),
                    webOrigins = client.webOrigins ?: emptyList(),
                    bearerOnly = client.isBearerOnly ?: false,
                    consentRequired = client.isConsentRequired ?: false,
                    standardFlowEnabled = client.isStandardFlowEnabled ?: true,
                    implicitFlowEnabled = client.isImplicitFlowEnabled ?: false,
                    directAccessGrantsEnabled = client.isDirectAccessGrantsEnabled ?: true,
                    serviceAccountsEnabled = client.isServiceAccountsEnabled ?: false,
                    publicClient = client.isPublicClient ?: false,
                    frontchannelLogout = client.isFrontchannelLogout ?: false,
                    protocol = client.protocol ?: "openid-connect",
                    attributes = client.attributes ?: emptyMap(),
                    fullScopeAllowed = client.isFullScopeAllowed ?: true,
                    nodeReRegistrationTimeout = client.nodeReRegistrationTimeout ?: -1,
                    defaultClientScopes = client.defaultClientScopes ?: emptyList(),
                    optionalClientScopes = client.optionalClientScopes ?: emptyList()
                )
            }
        } catch (e: Exception) {
            null
        }
    }

    fun createClient(realmName: String, request: CreateClientRequest): ClientDto? {
        return try {
            val realm = keycloak.realm(realmName)
            
            val clientRepresentation = ClientRepresentation().apply {
                clientId = request.clientId
                name = request.name
                description = request.description
                isEnabled = request.enabled
                redirectUris = request.redirectUris
                webOrigins = request.webOrigins
                isPublicClient = request.publicClient
                isStandardFlowEnabled = request.standardFlowEnabled
                isDirectAccessGrantsEnabled = request.directAccessGrantsEnabled
                isServiceAccountsEnabled = request.serviceAccountsEnabled
                protocol = "openid-connect"
            }
            
            val response: Response = realm.clients().create(clientRepresentation)
            
            if (response.status == 201) {
                // Extract the client ID from the location header
                val location = response.location.path
                val id = location.substring(location.lastIndexOf('/') + 1)
                
                // Fetch the created client to return it
                val createdClient = realm.clients().get(id).toRepresentation()
                ClientDto(
                    id = createdClient.id,
                    clientId = createdClient.clientId,
                    name = createdClient.name,
                    description = createdClient.description,
                    enabled = createdClient.isEnabled ?: true,
                    clientAuthenticatorType = createdClient.clientAuthenticatorType ?: "client-secret",
                    secret = createdClient.secret,
                    redirectUris = createdClient.redirectUris ?: emptyList(),
                    webOrigins = createdClient.webOrigins ?: emptyList(),
                    bearerOnly = createdClient.isBearerOnly ?: false,
                    consentRequired = createdClient.isConsentRequired ?: false,
                    standardFlowEnabled = createdClient.isStandardFlowEnabled ?: true,
                    implicitFlowEnabled = createdClient.isImplicitFlowEnabled ?: false,
                    directAccessGrantsEnabled = createdClient.isDirectAccessGrantsEnabled ?: true,
                    serviceAccountsEnabled = createdClient.isServiceAccountsEnabled ?: false,
                    publicClient = createdClient.isPublicClient ?: false,
                    frontchannelLogout = createdClient.isFrontchannelLogout ?: false,
                    protocol = createdClient.protocol ?: "openid-connect",
                    attributes = createdClient.attributes ?: emptyMap(),
                    fullScopeAllowed = createdClient.isFullScopeAllowed ?: true,
                    nodeReRegistrationTimeout = createdClient.nodeReRegistrationTimeout ?: -1,
                    defaultClientScopes = createdClient.defaultClientScopes ?: emptyList(),
                    optionalClientScopes = createdClient.optionalClientScopes ?: emptyList()
                )
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    fun updateClient(realmName: String, clientId: String, request: UpdateClientRequest): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                false
            } else {
                val client = clients[0]
                val clientResource = realm.clients().get(client.id)
                val clientRepresentation = clientResource.toRepresentation()
                
                // Update only the provided fields
                request.name?.let { clientRepresentation.name = it }
                request.description?.let { clientRepresentation.description = it }
                request.enabled?.let { clientRepresentation.isEnabled = it }
                request.redirectUris?.let { clientRepresentation.redirectUris = it }
                request.webOrigins?.let { clientRepresentation.webOrigins = it }
                request.publicClient?.let { clientRepresentation.isPublicClient = it }
                request.standardFlowEnabled?.let { clientRepresentation.isStandardFlowEnabled = it }
                request.directAccessGrantsEnabled?.let { clientRepresentation.isDirectAccessGrantsEnabled = it }
                request.serviceAccountsEnabled?.let { clientRepresentation.isServiceAccountsEnabled = it }
                
                clientResource.update(clientRepresentation)
                true
            }
        } catch (e: Exception) {
            false
        }
    }

    fun deleteClient(realmName: String, clientId: String): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                false
            } else {
                val client = clients[0]
                realm.clients().get(client.id).remove()
                true
            }
        } catch (e: Exception) {
            false
        }
    }

    fun regenerateClientSecret(realmName: String, clientId: String): String? {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                null
            } else {
                val client = clients[0]
                val clientResource = realm.clients().get(client.id)
                val credential = clientResource.generateNewSecret()
                credential.value
            }
        } catch (e: Exception) {
            null
        }
    }
}