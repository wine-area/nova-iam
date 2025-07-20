package com.nova.iam.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityEnhancementConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            // CSRF protection 
            .csrf { csrf ->
                csrf.disable() // Disabled for API-only application
            }
            
            // CORS configuration
            .cors { cors ->
                cors.configure(http)
            }
            
            // Security headers
            .headers { headers ->
                headers
                    .frameOptions { frameOptions ->
                        frameOptions.deny()
                    }
                    .contentTypeOptions { contentTypeOptions ->
                        contentTypeOptions.and()
                    }
                    .httpStrictTransportSecurity { hstsConfig ->
                        hstsConfig
                            .maxAgeInSeconds(31536000)
                    }
            }
            
            // Authorization rules
            .authorizeHttpRequests { authz ->
                authz
                    .requestMatchers("/actuator/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()
                    .anyRequest().permitAll() // Temporarily allow all for development
            }

        return http.build()
    }
}