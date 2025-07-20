package com.nova.iam.dto

data class RealmDto(
    val id: String?,
    val realm: String,
    val displayName: String?,
    val enabled: Boolean = true,
    val loginTheme: String?,
    val accountTheme: String?,
    val adminTheme: String?,
    val emailTheme: String?
)