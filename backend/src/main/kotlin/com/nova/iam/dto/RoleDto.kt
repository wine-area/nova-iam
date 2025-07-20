package com.nova.iam.dto

data class RoleDto(
    val id: String? = null,
    val name: String,
    val description: String? = null,
    val composite: Boolean = false,
    val clientRole: Boolean = false,
    val containerId: String,
    val attributes: Map<String, List<String>> = emptyMap()
)

data class CreateRoleRequest(
    val name: String,
    val description: String? = null,
    val composite: Boolean = false
)

data class UpdateRoleRequest(
    val name: String? = null,
    val description: String? = null,
    val composite: Boolean? = null
)

data class RoleAssignmentDto(
    val userId: String,
    val username: String? = null,
    val roles: List<RoleDto>
)

data class AssignRoleRequest(
    val roleNames: List<String>
)