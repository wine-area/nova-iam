package com.nova.iam.dto

import com.nova.iam.validation.ValidRealmName
import com.nova.iam.validation.SafeString
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RealmDto(
    val id: String?,
    
    @field:NotBlank(message = "Realm name is required")
    @field:ValidRealmName
    val realm: String,
    
    @field:SafeString
    @field:Size(max = 255, message = "Display name must not exceed 255 characters")
    val displayName: String?,
    
    val enabled: Boolean = true,
    
    @field:SafeString
    @field:Size(max = 100, message = "Theme name must not exceed 100 characters")
    val loginTheme: String?,
    
    @field:SafeString
    @field:Size(max = 100, message = "Theme name must not exceed 100 characters") 
    val accountTheme: String?,
    
    @field:SafeString
    @field:Size(max = 100, message = "Theme name must not exceed 100 characters")
    val adminTheme: String?,
    
    @field:SafeString
    @field:Size(max = 100, message = "Theme name must not exceed 100 characters")
    val emailTheme: String?
)