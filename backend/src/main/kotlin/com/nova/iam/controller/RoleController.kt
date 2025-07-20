package com.nova.iam.controller

import com.nova.iam.dto.RoleDto
import com.nova.iam.dto.CreateRoleRequest
import com.nova.iam.dto.UpdateRoleRequest
import com.nova.iam.dto.RoleAssignmentDto
import com.nova.iam.dto.AssignRoleRequest
import com.nova.iam.service.RoleService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/realms/{realmName}/roles")
class RoleController(private val roleService: RoleService) {

    // Realm Roles
    @GetMapping("/realm")
    fun getRealmRoles(@PathVariable realmName: String): ResponseEntity<List<RoleDto>> {
        return try {
            val roles = roleService.getRealmRoles(realmName)
            ResponseEntity.ok(roles)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PostMapping("/realm")
    fun createRealmRole(
        @PathVariable realmName: String,
        @RequestBody request: CreateRoleRequest
    ): ResponseEntity<RoleDto> {
        return try {
            val role = roleService.createRealmRole(realmName, request)
            role?.let {
                ResponseEntity.ok(it)
            } ?: ResponseEntity.badRequest().build()
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PutMapping("/realm/{roleName}")
    fun updateRealmRole(
        @PathVariable realmName: String,
        @PathVariable roleName: String,
        @RequestBody request: UpdateRoleRequest
    ): ResponseEntity<Void> {
        return try {
            val success = roleService.updateRealmRole(realmName, roleName, request)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/realm/{roleName}")
    fun deleteRealmRole(
        @PathVariable realmName: String,
        @PathVariable roleName: String
    ): ResponseEntity<Void> {
        return try {
            val success = roleService.deleteRealmRole(realmName, roleName)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    // Client Roles
    @GetMapping("/client/{clientId}")
    fun getClientRoles(
        @PathVariable realmName: String,
        @PathVariable clientId: String
    ): ResponseEntity<List<RoleDto>> {
        return try {
            val roles = roleService.getClientRoles(realmName, clientId)
            ResponseEntity.ok(roles)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PostMapping("/client/{clientId}")
    fun createClientRole(
        @PathVariable realmName: String,
        @PathVariable clientId: String,
        @RequestBody request: CreateRoleRequest
    ): ResponseEntity<RoleDto> {
        return try {
            val role = roleService.createClientRole(realmName, clientId, request)
            role?.let {
                ResponseEntity.ok(it)
            } ?: ResponseEntity.badRequest().build()
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PutMapping("/client/{clientId}/{roleName}")
    fun updateClientRole(
        @PathVariable realmName: String,
        @PathVariable clientId: String,
        @PathVariable roleName: String,
        @RequestBody request: UpdateRoleRequest
    ): ResponseEntity<Void> {
        return try {
            val success = roleService.updateClientRole(realmName, clientId, roleName, request)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/client/{clientId}/{roleName}")
    fun deleteClientRole(
        @PathVariable realmName: String,
        @PathVariable clientId: String,
        @PathVariable roleName: String
    ): ResponseEntity<Void> {
        return try {
            val success = roleService.deleteClientRole(realmName, clientId, roleName)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    // User Role Assignments
    @GetMapping("/user/{userId}")
    fun getUserRoles(
        @PathVariable realmName: String,
        @PathVariable userId: String
    ): ResponseEntity<RoleAssignmentDto> {
        return roleService.getUserRoles(realmName, userId)?.let { assignment ->
            ResponseEntity.ok(assignment)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping("/user/{userId}/realm")
    fun assignRealmRolesToUser(
        @PathVariable realmName: String,
        @PathVariable userId: String,
        @RequestBody request: AssignRoleRequest
    ): ResponseEntity<Void> {
        return try {
            val success = roleService.assignRealmRolesToUser(realmName, userId, request)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.badRequest().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/user/{userId}/realm")
    fun removeRealmRolesFromUser(
        @PathVariable realmName: String,
        @PathVariable userId: String,
        @RequestBody request: AssignRoleRequest
    ): ResponseEntity<Void> {
        return try {
            val success = roleService.removeRealmRolesFromUser(realmName, userId, request)
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