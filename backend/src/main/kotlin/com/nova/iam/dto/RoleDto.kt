package com.nova.iam.dto

import com.nova.iam.validation.ValidRoleName
import com.nova.iam.validation.SafeString
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RoleDto(
    val id: String? = null,
    
    @field:NotBlank(message = "Role name is required")
    @field:ValidRoleName
    val name: String,
    
    @field:SafeString
    @field:Size(max = 500, message = "Description must not exceed 500 characters")
    val description: String? = null,
    val composite: Boolean = false,
    val clientRole: Boolean = false,
    val containerId: String,
    val attributes: Map<String, List<String>> = emptyMap()
)

data class CreateRoleRequest(
    @field:NotBlank(message = "Role name is required")
    @field:ValidRoleName
    val name: String,
    
    @field:SafeString
    @field:Size(max = 500, message = "Description must not exceed 500 characters")
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