package com.nova.iam.service

import com.nova.iam.dto.RealmDto
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.RealmRepresentation
import org.springframework.stereotype.Service

@Service
class RealmService(private val keycloak: Keycloak) {

    fun getAllRealms(): List<RealmDto> {
        return keycloak.realms().findAll().map { realm ->
            RealmDto(
                id = realm.id,
                realm = realm.realm,
                displayName = realm.displayName,
                enabled = realm.isEnabled ?: true,
                loginTheme = realm.loginTheme,
                accountTheme = realm.accountTheme,
                adminTheme = realm.adminTheme,
                emailTheme = realm.emailTheme
            )
        }
    }

    fun getRealm(realmName: String): RealmDto? {
        return try {
            val realm = keycloak.realm(realmName).toRepresentation()
            RealmDto(
                id = realm.id,
                realm = realm.realm,
                displayName = realm.displayName,
                enabled = realm.isEnabled ?: true,
                loginTheme = realm.loginTheme,
                accountTheme = realm.accountTheme,
                adminTheme = realm.adminTheme,
                emailTheme = realm.emailTheme
            )
        } catch (e: Exception) {
            null
        }
    }

    fun createRealm(realmDto: RealmDto): RealmDto {
        val realmRepresentation = RealmRepresentation().apply {
            realm = realmDto.realm
            displayName = realmDto.displayName
            isEnabled = realmDto.enabled
            loginTheme = realmDto.loginTheme
            accountTheme = realmDto.accountTheme
            adminTheme = realmDto.adminTheme
            emailTheme = realmDto.emailTheme
        }
        
        keycloak.realms().create(realmRepresentation)
        
        return getRealm(realmDto.realm) ?: throw RuntimeException("Failed to create realm")
    }
}