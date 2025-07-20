package com.nova.iam.controller

import com.nova.iam.dto.GroupDto
import com.nova.iam.dto.CreateGroupRequest
import com.nova.iam.dto.UpdateGroupRequest
import com.nova.iam.dto.GroupMemberDto
import com.nova.iam.service.GroupService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/realms/{realmName}/groups")
class GroupController(private val groupService: GroupService) {

    @GetMapping
    fun getGroups(@PathVariable realmName: String): ResponseEntity<List<GroupDto>> {
        return try {
            val groups = groupService.getGroups(realmName)
            ResponseEntity.ok(groups)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @GetMapping("/{groupId}")
    fun getGroup(
        @PathVariable realmName: String,
        @PathVariable groupId: String
    ): ResponseEntity<GroupDto> {
        return groupService.getGroup(realmName, groupId)?.let { group ->
            ResponseEntity.ok(group)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createGroup(
        @PathVariable realmName: String,
        @RequestBody request: CreateGroupRequest
    ): ResponseEntity<GroupDto> {
        return try {
            val group = groupService.createGroup(realmName, request)
            group?.let {
                ResponseEntity.ok(it)
            } ?: ResponseEntity.badRequest().build()
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PutMapping("/{groupId}")
    fun updateGroup(
        @PathVariable realmName: String,
        @PathVariable groupId: String,
        @RequestBody request: UpdateGroupRequest
    ): ResponseEntity<Void> {
        return try {
            val success = groupService.updateGroup(realmName, groupId, request)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/{groupId}")
    fun deleteGroup(
        @PathVariable realmName: String,
        @PathVariable groupId: String
    ): ResponseEntity<Void> {
        return try {
            val success = groupService.deleteGroup(realmName, groupId)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @GetMapping("/{groupId}/members")
    fun getGroupMembers(
        @PathVariable realmName: String,
        @PathVariable groupId: String
    ): ResponseEntity<List<GroupMemberDto>> {
        return try {
            val members = groupService.getGroupMembers(realmName, groupId)
            ResponseEntity.ok(members)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PostMapping("/{groupId}/members/{userId}")
    fun addUserToGroup(
        @PathVariable realmName: String,
        @PathVariable groupId: String,
        @PathVariable userId: String
    ): ResponseEntity<Void> {
        return try {
            val success = groupService.addUserToGroup(realmName, groupId, userId)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.badRequest().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    fun removeUserFromGroup(
        @PathVariable realmName: String,
        @PathVariable groupId: String,
        @PathVariable userId: String
    ): ResponseEntity<Void> {
        return try {
            val success = groupService.removeUserFromGroup(realmName, groupId, userId)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.badRequest().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }
}