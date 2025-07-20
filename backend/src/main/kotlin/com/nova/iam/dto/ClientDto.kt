package com.nova.iam.dto

import com.nova.iam.validation.ValidClientId
import com.nova.iam.validation.SafeString
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Pattern

data class ClientDto(
    val id: String? = null,
    
    @field:NotBlank(message = "Client ID is required")
    @field:ValidClientId
    val clientId: String,
    
    @field:SafeString
    @field:Size(max = 255, message = "Name must not exceed 255 characters")
    val name: String? = null,
    
    @field:SafeString
    @field:Size(max = 500, message = "Description must not exceed 500 characters")
    val description: String? = null,
    val enabled: Boolean = true,
    val clientAuthenticatorType: String = "client-secret",
    val secret: String? = null,
    val registrationAccessToken: String? = null,
    val defaultScopes: List<String> = emptyList(),
    val optionalScopes: List<String> = emptyList(),
    val redirectUris: List<String> = emptyList(),
    val webOrigins: List<String> = emptyList(),
    val notBefore: Int = 0,
    val bearerOnly: Boolean = false,
    val consentRequired: Boolean = false,
    val standardFlowEnabled: Boolean = true,
    val implicitFlowEnabled: Boolean = false,
    val directAccessGrantsEnabled: Boolean = true,
    val serviceAccountsEnabled: Boolean = false,
    val publicClient: Boolean = false,
    val frontchannelLogout: Boolean = false,
    val protocol: String = "openid-connect",
    val attributes: Map<String, String> = emptyMap(),
    val fullScopeAllowed: Boolean = true,
    val nodeReRegistrationTimeout: Int = -1,
    val defaultClientScopes: List<String> = emptyList(),
    val optionalClientScopes: List<String> = emptyList()
)

data class CreateClientRequest(
    @field:NotBlank(message = "Client ID is required")
    @field:ValidClientId
    val clientId: String,
    
    @field:SafeString
    @field:Size(max = 255, message = "Name must not exceed 255 characters")
    val name: String? = null,
    
    @field:SafeString
    @field:Size(max = 500, message = "Description must not exceed 500 characters")
    val description: String? = null,
    val enabled: Boolean = true,
    val redirectUris: List<String> = emptyList(),
    val webOrigins: List<String> = emptyList(),
    val publicClient: Boolean = false,
    val standardFlowEnabled: Boolean = true,
    val directAccessGrantsEnabled: Boolean = true,
    val serviceAccountsEnabled: Boolean = false
)

data class UpdateClientRequest(
    val name: String? = null,
    val description: String? = null,
    val enabled: Boolean? = null,
    val redirectUris: List<String>? = null,
    val webOrigins: List<String>? = null,
    val publicClient: Boolean? = null,
    val standardFlowEnabled: Boolean? = null,
    val directAccessGrantsEnabled: Boolean? = null,
    val serviceAccountsEnabled: Boolean? = null
)