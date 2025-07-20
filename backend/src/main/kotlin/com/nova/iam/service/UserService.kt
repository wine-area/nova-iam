package com.nova.iam.service

import com.nova.iam.dto.CreateUserRequest
import com.nova.iam.dto.UserDto
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.stereotype.Service

@Service
class UserService(private val keycloak: Keycloak) {

    fun getUsers(realmName: String): List<UserDto> {
        return keycloak.realm(realmName).users().list().map { user ->
            UserDto(
                id = user.id,
                username = user.username,
                email = user.email,
                firstName = user.firstName,
                lastName = user.lastName,
                enabled = user.isEnabled ?: true,
                emailVerified = user.isEmailVerified ?: false,
                attributes = user.attributes
            )
        }
    }

    fun getUser(realmName: String, userId: String): UserDto? {
        return try {
            val user = keycloak.realm(realmName).users().get(userId).toRepresentation()
            UserDto(
                id = user.id,
                username = user.username,
                email = user.email,
                firstName = user.firstName,
                lastName = user.lastName,
                enabled = user.isEnabled ?: true,
                emailVerified = user.isEmailVerified ?: false,
                attributes = user.attributes
            )
        } catch (e: Exception) {
            null
        }
    }

    fun createUser(realmName: String, createUserRequest: CreateUserRequest): UserDto {
        val userRepresentation = UserRepresentation().apply {
            username = createUserRequest.username
            email = createUserRequest.email
            firstName = createUserRequest.firstName
            lastName = createUserRequest.lastName
            isEnabled = createUserRequest.enabled
            isEmailVerified = false
        }

        val response = keycloak.realm(realmName).users().create(userRepresentation)
        
        if (response.status != 201) {
            throw RuntimeException("Failed to create user: ${response.statusInfo}")
        }

        // Set password if provided
        createUserRequest.password?.let { password ->
            val userId = response.location.path.substringAfterLast("/")
            val credential = CredentialRepresentation().apply {
                type = CredentialRepresentation.PASSWORD
                value = password
                isTemporary = false
            }
            keycloak.realm(realmName).users().get(userId).resetPassword(credential)
        }

        val userId = response.location.path.substringAfterLast("/")
        return getUser(realmName, userId) ?: throw RuntimeException("Failed to retrieve created user")
    }
}