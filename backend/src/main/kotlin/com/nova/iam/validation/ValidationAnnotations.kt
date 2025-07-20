package com.nova.iam.validation

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import kotlin.reflect.KClass
import java.util.regex.Pattern

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [SafeStringValidator::class])
annotation class SafeString(
    val message: String = "String contains potentially unsafe characters",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class SafeStringValidator : ConstraintValidator<SafeString, String?> {
    
    // Pattern to match safe strings (alphanumeric, spaces, hyphens, underscores, dots)
    private val safePattern = Pattern.compile("^[a-zA-Z0-9\\s\\-_.@+]*$")
    
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        
        // Check for common injection patterns
        if (containsInjectionPatterns(value)) {
            return false
        }
        
        // Check against safe pattern
        return safePattern.matcher(value).matches()
    }
    
    private fun containsInjectionPatterns(value: String): Boolean {
        val lowerValue = value.lowercase()
        
        // SQL injection patterns
        val sqlPatterns = listOf(
            "select", "insert", "update", "delete", "drop", "create", "alter",
            "union", "script", "javascript", "vbscript", "onload", "onerror",
            "<script", "</script", "eval(", "expression("
        )
        
        return sqlPatterns.any { pattern ->
            lowerValue.contains(pattern)
        }
    }
}

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [ValidRealmNameValidator::class])
annotation class ValidRealmName(
    val message: String = "Invalid realm name format",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class ValidRealmNameValidator : ConstraintValidator<ValidRealmName, String?> {
    
    // Realm names should be simple identifiers
    private val realmPattern = Pattern.compile("^[a-zA-Z0-9][a-zA-Z0-9\\-_]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$")
    
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        
        // Must be between 1 and 50 characters
        if (value.length < 1 || value.length > 50) {
            return false
        }
        
        // Must match realm pattern
        return realmPattern.matcher(value).matches()
    }
}

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [ValidClientIdValidator::class])
annotation class ValidClientId(
    val message: String = "Invalid client ID format",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class ValidClientIdValidator : ConstraintValidator<ValidClientId, String?> {
    
    // Client IDs should be URL-safe identifiers
    private val clientIdPattern = Pattern.compile("^[a-zA-Z0-9][a-zA-Z0-9\\-_.]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$")
    
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        
        // Must be between 1 and 100 characters
        if (value.length < 1 || value.length > 100) {
            return false
        }
        
        // Must match client ID pattern
        return clientIdPattern.matcher(value).matches()
    }
}

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [ValidRoleNameValidator::class])
annotation class ValidRoleName(
    val message: String = "Invalid role name format",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class ValidRoleNameValidator : ConstraintValidator<ValidRoleName, String?> {
    
    // Role names should be simple identifiers
    private val rolePattern = Pattern.compile("^[a-zA-Z0-9][a-zA-Z0-9\\-_:]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$")
    
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        
        // Must be between 1 and 100 characters
        if (value.length < 1 || value.length > 100) {
            return false
        }
        
        // Must match role pattern
        return rolePattern.matcher(value).matches()
    }
}

@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [ValidGroupNameValidator::class])
annotation class ValidGroupName(
    val message: String = "Invalid group name format",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class ValidGroupNameValidator : ConstraintValidator<ValidGroupName, String?> {
    
    // Group names should be simple identifiers, similar to roles but allowing forward slashes for hierarchy
    private val groupPattern = Pattern.compile("^[a-zA-Z0-9][a-zA-Z0-9\\-_:/]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$")
    
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        if (value == null) return true
        
        // Must be between 1 and 100 characters
        if (value.length < 1 || value.length > 100) {
            return false
        }
        
        // Must match group pattern
        return groupPattern.matcher(value).matches()
    }
}