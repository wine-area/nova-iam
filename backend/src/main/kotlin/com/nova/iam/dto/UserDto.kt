package com.nova.iam.dto

data class UserDto(
    val id: String?,
    val username: String,
    val email: String?,
    val firstName: String?,
    val lastName: String?,
    val enabled: Boolean = true,
    val emailVerified: Boolean = false,
    val attributes: Map<String, List<String>>? = null
)

data class CreateUserRequest(
    val username: String,
    val email: String?,
    val firstName: String?,
    val lastName: String?,
    val password: String?,
    val enabled: Boolean = true
)