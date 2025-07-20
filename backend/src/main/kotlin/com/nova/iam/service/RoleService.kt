package com.nova.iam.service

import com.nova.iam.dto.RoleDto
import com.nova.iam.dto.CreateRoleRequest
import com.nova.iam.dto.UpdateRoleRequest
import com.nova.iam.dto.RoleAssignmentDto
import com.nova.iam.dto.AssignRoleRequest
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.RoleRepresentation
import org.springframework.stereotype.Service

@Service
class RoleService(private val keycloak: Keycloak) {

    // Realm Roles
    fun getRealmRoles(realmName: String): List<RoleDto> {
        val realm = keycloak.realm(realmName)
        val roles = realm.roles().list()
        
        return roles.map { role ->
            RoleDto(
                id = role.id,
                name = role.name,
                description = role.description,
                composite = role.isComposite ?: false,
                clientRole = false,
                containerId = realmName,
                attributes = role.attributes ?: emptyMap()
            )
        }
    }

    fun createRealmRole(realmName: String, request: CreateRoleRequest): RoleDto? {
        return try {
            val realm = keycloak.realm(realmName)
            
            val roleRepresentation = RoleRepresentation().apply {
                name = request.name
                description = request.description
                isComposite = request.composite
            }
            
            realm.roles().create(roleRepresentation)
            
            // Fetch the created role to return it
            val createdRole = realm.roles().get(request.name).toRepresentation()
            RoleDto(
                id = createdRole.id,
                name = createdRole.name,
                description = createdRole.description,
                composite = createdRole.isComposite ?: false,
                clientRole = false,
                containerId = realmName,
                attributes = createdRole.attributes ?: emptyMap()
            )
        } catch (e: Exception) {
            null
        }
    }

    fun updateRealmRole(realmName: String, roleName: String, request: UpdateRoleRequest): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val roleResource = realm.roles().get(roleName)
            val roleRepresentation = roleResource.toRepresentation()
            
            // Update only the provided fields
            request.name?.let { roleRepresentation.name = it }
            request.description?.let { roleRepresentation.description = it }
            request.composite?.let { roleRepresentation.isComposite = it }
            
            roleResource.update(roleRepresentation)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deleteRealmRole(realmName: String, roleName: String): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            realm.roles().get(roleName).remove()
            true
        } catch (e: Exception) {
            false
        }
    }

    // Client Roles
    fun getClientRoles(realmName: String, clientId: String): List<RoleDto> {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                emptyList()
            } else {
                val client = clients[0]
                val roles = realm.clients().get(client.id).roles().list()
                
                roles.map { role ->
                    RoleDto(
                        id = role.id,
                        name = role.name,
                        description = role.description,
                        composite = role.isComposite ?: false,
                        clientRole = true,
                        containerId = client.id,
                        attributes = role.attributes ?: emptyMap()
                    )
                }
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun createClientRole(realmName: String, clientId: String, request: CreateRoleRequest): RoleDto? {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                null
            } else {
                val client = clients[0]
                val clientResource = realm.clients().get(client.id)
                
                val roleRepresentation = RoleRepresentation().apply {
                    name = request.name
                    description = request.description
                    isComposite = request.composite
                    // Note: isClientRole is not a property of RoleRepresentation
                    // containerId is set when adding to client
                }
                
                clientResource.roles().create(roleRepresentation)
                
                // Fetch the created role to return it
                val createdRole = clientResource.roles().get(request.name).toRepresentation()
                RoleDto(
                    id = createdRole.id,
                    name = createdRole.name,
                    description = createdRole.description,
                    composite = createdRole.isComposite ?: false,
                    clientRole = true,
                    containerId = client.id,
                    attributes = createdRole.attributes ?: emptyMap()
                )
            }
        } catch (e: Exception) {
            null
        }
    }

    fun updateClientRole(realmName: String, clientId: String, roleName: String, request: UpdateRoleRequest): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                false
            } else {
                val client = clients[0]
                val roleResource = realm.clients().get(client.id).roles().get(roleName)
                val roleRepresentation = roleResource.toRepresentation()
                
                // Update only the provided fields
                request.name?.let { roleRepresentation.name = it }
                request.description?.let { roleRepresentation.description = it }
                request.composite?.let { roleRepresentation.isComposite = it }
                
                roleResource.update(roleRepresentation)
                true
            }
        } catch (e: Exception) {
            false
        }
    }

    fun deleteClientRole(realmName: String, clientId: String, roleName: String): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val clients = realm.clients().findByClientId(clientId)
            
            if (clients.isEmpty()) {
                false
            } else {
                val client = clients[0]
                realm.clients().get(client.id).roles().get(roleName).remove()
                true
            }
        } catch (e: Exception) {
            false
        }
    }

    // Role Assignment to Users - Simplified version
    fun getUserRoles(realmName: String, userId: String): RoleAssignmentDto? {
        return try {
            val realm = keycloak.realm(realmName)
            val userResource = realm.users().get(userId)
            val user = userResource.toRepresentation()
            val realmRoles = userResource.roles().realmLevel().listAll()
            
            val allRoles = mutableListOf<RoleDto>()
            
            // Add realm roles
            realmRoles.forEach { role ->
                allRoles.add(RoleDto(
                    id = role.id,
                    name = role.name,
                    description = role.description,
                    composite = role.isComposite ?: false,
                    clientRole = false,
                    containerId = realmName,
                    attributes = role.attributes ?: emptyMap()
                ))
            }
            
            RoleAssignmentDto(
                userId = userId,
                username = user.username,
                roles = allRoles
            )
        } catch (e: Exception) {
            null
        }
    }

    fun assignRealmRolesToUser(realmName: String, userId: String, request: AssignRoleRequest): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val userResource = realm.users().get(userId)
            val rolesToAssign = mutableListOf<RoleRepresentation>()
            
            request.roleNames.forEach { roleName ->
                try {
                    val role = realm.roles().get(roleName).toRepresentation()
                    rolesToAssign.add(role)
                } catch (e: Exception) {
                    // Role doesn't exist, skip it
                }
            }
            
            if (rolesToAssign.isNotEmpty()) {
                userResource.roles().realmLevel().add(rolesToAssign)
            }
            true
        } catch (e: Exception) {
            false
        }
    }

    fun removeRealmRolesFromUser(realmName: String, userId: String, request: AssignRoleRequest): Boolean {
        return try {
            val realm = keycloak.realm(realmName)
            val userResource = realm.users().get(userId)
            val rolesToRemove = mutableListOf<RoleRepresentation>()
            
            request.roleNames.forEach { roleName ->
                try {
                    val role = realm.roles().get(roleName).toRepresentation()
                    rolesToRemove.add(role)
                } catch (e: Exception) {
                    // Role doesn't exist, skip it
                }
            }
            
            if (rolesToRemove.isNotEmpty()) {
                userResource.roles().realmLevel().remove(rolesToRemove)
            }
            true
        } catch (e: Exception) {
            false
        }
    }

    // Note: Client role assignment methods removed for simplification
    // They can be added later when needed
}