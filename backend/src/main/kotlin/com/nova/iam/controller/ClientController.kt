package com.nova.iam.controller

import com.nova.iam.dto.ClientDto
import com.nova.iam.dto.CreateClientRequest
import com.nova.iam.dto.UpdateClientRequest
import com.nova.iam.service.ClientService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/realms/{realmName}/clients")
class ClientController(private val clientService: ClientService) {

    @GetMapping
    fun getAllClients(@PathVariable realmName: String): ResponseEntity<List<ClientDto>> {
        return try {
            val clients = clientService.getAllClients(realmName)
            ResponseEntity.ok(clients)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @GetMapping("/{clientId}")
    fun getClient(
        @PathVariable realmName: String,
        @PathVariable clientId: String
    ): ResponseEntity<ClientDto> {
        return clientService.getClient(realmName, clientId)?.let { client ->
            ResponseEntity.ok(client)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createClient(
        @PathVariable realmName: String,
        @RequestBody request: CreateClientRequest
    ): ResponseEntity<ClientDto> {
        return try {
            val client = clientService.createClient(realmName, request)
            client?.let {
                ResponseEntity.ok(it)
            } ?: ResponseEntity.badRequest().build()
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PutMapping("/{clientId}")
    fun updateClient(
        @PathVariable realmName: String,
        @PathVariable clientId: String,
        @RequestBody request: UpdateClientRequest
    ): ResponseEntity<Void> {
        return try {
            val success = clientService.updateClient(realmName, clientId, request)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @DeleteMapping("/{clientId}")
    fun deleteClient(
        @PathVariable realmName: String,
        @PathVariable clientId: String
    ): ResponseEntity<Void> {
        return try {
            val success = clientService.deleteClient(realmName, clientId)
            if (success) {
                ResponseEntity.ok().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @PostMapping("/{clientId}/regenerate-secret")
    fun regenerateClientSecret(
        @PathVariable realmName: String,
        @PathVariable clientId: String
    ): ResponseEntity<Map<String, String>> {
        return try {
            val newSecret = clientService.regenerateClientSecret(realmName, clientId)
            newSecret?.let {
                ResponseEntity.ok(mapOf("secret" to it))
            } ?: ResponseEntity.notFound().build()
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }
}