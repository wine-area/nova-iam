package com.nova.iam.controller

import com.nova.iam.dto.RealmDto
import com.nova.iam.service.RealmService
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid

@RestController
@RequestMapping("/api/realms")
@Validated
class RealmController(private val realmService: RealmService) {

    @GetMapping
    fun getAllRealms(): ResponseEntity<List<RealmDto>> {
        return try {
            val realms = realmService.getAllRealms()
            ResponseEntity.ok(realms)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @GetMapping("/{realmName}")
    fun getRealm(@PathVariable realmName: String): ResponseEntity<RealmDto> {
        return realmService.getRealm(realmName)?.let { realm ->
            ResponseEntity.ok(realm)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createRealm(@RequestBody @Valid realmDto: RealmDto): ResponseEntity<RealmDto> {
        return try {
            val createdRealm = realmService.createRealm(realmDto)
            ResponseEntity.ok(createdRealm)
        } catch (e: Exception) {
            ResponseEntity.badRequest().build()
        }
    }
}