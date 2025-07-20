package com.nova.iam.config

import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class KeycloakConfig {

    @Value("\${keycloak.server-url}")
    private lateinit var serverUrl: String

    @Value("\${keycloak.admin.realm}")
    private lateinit var realm: String

    @Value("\${keycloak.admin.username}")
    private lateinit var username: String

    @Value("\${keycloak.admin.password}")
    private lateinit var password: String

    @Bean
    fun keycloak(): Keycloak {
        return KeycloakBuilder.builder()
            .serverUrl(serverUrl)
            .realm(realm)
            .username(username)
            .password(password)
            .clientId("admin-cli")
            .build()
    }
}