package com.nova.iam.service

import com.nova.iam.dto.GroupDto
import com.nova.iam.dto.CreateGroupRequest
import com.nova.iam.dto.UpdateGroupRequest
import com.nova.iam.dto.GroupMemberDto
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.GroupRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.stereotype.Service

@Service
class GroupService(private val keycloak: Keycloak) {

    fun getGroups(realmName: String): List<GroupDto> {
        return keycloak.realm(realmName).groups().groups().map { group ->
            convertToGroupDto(group)
        }
    }

    fun getGroup(realmName: String, groupId: String): GroupDto? {
        return try {
            val group = keycloak.realm(realmName).groups().group(groupId).toRepresentation()
            convertToGroupDto(group)
        } catch (e: Exception) {
            null
        }
    }

    fun createGroup(realmName: String, request: CreateGroupRequest): GroupDto? {
        return try {
            val groupRepresentation = GroupRepresentation().apply {
                name = request.name
                path = request.path
                attributes = request.attributes
            }

            val response = keycloak.realm(realmName).groups().add(groupRepresentation)
            
            if (response.status != 201) {
                throw RuntimeException("Failed to create group: ${response.statusInfo}")
            }

            val groupId = response.location.path.substringAfterLast("/")
            getGroup(realmName, groupId)
        } catch (e: Exception) {
            null
        }
    }

    fun updateGroup(realmName: String, groupId: String, request: UpdateGroupRequest): Boolean {
        return try {
            val groupResource = keycloak.realm(realmName).groups().group(groupId)
            val groupRepresentation = groupResource.toRepresentation()
            
            // Update only the provided fields
            request.name?.let { groupRepresentation.name = it }
            request.path?.let { groupRepresentation.path = it }
            request.attributes?.let { groupRepresentation.attributes = it }
            
            groupResource.update(groupRepresentation)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deleteGroup(realmName: String, groupId: String): Boolean {
        return try {
            keycloak.realm(realmName).groups().group(groupId).remove()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getGroupMembers(realmName: String, groupId: String): List<GroupMemberDto> {
        return try {
            keycloak.realm(realmName).groups().group(groupId).members().map { user ->
                convertToGroupMemberDto(user)
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun addUserToGroup(realmName: String, groupId: String, userId: String): Boolean {
        return try {
            keycloak.realm(realmName).users().get(userId).joinGroup(groupId)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun removeUserFromGroup(realmName: String, groupId: String, userId: String): Boolean {
        return try {
            keycloak.realm(realmName).users().get(userId).leaveGroup(groupId)
            true
        } catch (e: Exception) {
            false
        }
    }

    private fun convertToGroupDto(group: GroupRepresentation): GroupDto {
        return GroupDto(
            id = group.id,
            name = group.name,
            path = group.path,
            parentId = null, // Keycloak GroupRepresentation doesn't have parentId directly
            subGroups = group.subGroups?.map { convertToGroupDto(it) },
            attributes = group.attributes ?: emptyMap()
        )
    }

    private fun convertToGroupMemberDto(user: UserRepresentation): GroupMemberDto {
        return GroupMemberDto(
            id = user.id,
            username = user.username,
            email = user.email,
            firstName = user.firstName,
            lastName = user.lastName,
            enabled = user.isEnabled ?: true
        )
    }
}