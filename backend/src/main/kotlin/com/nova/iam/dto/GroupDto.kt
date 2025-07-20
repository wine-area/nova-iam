package com.nova.iam.dto

import com.nova.iam.validation.ValidGroupName
import com.nova.iam.validation.SafeString
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class GroupDto(
    val id: String? = null,
    
    @field:NotBlank(message = "Group name is required")
    @field:ValidGroupName
    val name: String,
    
    @field:SafeString
    @field:Size(max = 500, message = "Description must not exceed 500 characters")
    val path: String? = null,
    val parentId: String? = null,
    val subGroups: List<GroupDto>? = null,
    val attributes: Map<String, List<String>> = emptyMap()
)

data class CreateGroupRequest(
    @field:NotBlank(message = "Group name is required")
    @field:ValidGroupName
    val name: String,
    
    @field:SafeString
    @field:Size(max = 500, message = "Path must not exceed 500 characters")
    val path: String? = null,
    val parentId: String? = null,
    val attributes: Map<String, List<String>> = emptyMap()
)

data class UpdateGroupRequest(
    val name: String? = null,
    val path: String? = null,
    val parentId: String? = null,
    val attributes: Map<String, List<String>>? = null
)

data class GroupMemberDto(
    val id: String,
    val username: String,
    val email: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val enabled: Boolean = true
)

data class AddGroupMemberRequest(
    val userId: String
)