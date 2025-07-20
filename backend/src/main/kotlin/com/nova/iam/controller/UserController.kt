package com.nova.iam.controller

import com.nova.iam.dto.CreateUserRequest
import com.nova.iam.dto.UserDto
import com.nova.iam.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/realms/{realmName}/users")
class UserController(private val userService: UserService) {

    @GetMapping
    fun getUsers(@PathVariable realmName: String): ResponseEntity<List<UserDto>> {
        return try {
            val users = userService.getUsers(realmName)
            ResponseEntity.ok(users)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().build()
        }
    }

    @GetMapping("/{userId}")
    fun getUser(
        @PathVariable realmName: String,
        @PathVariable userId: String
    ): ResponseEntity<UserDto> {
        return userService.getUser(realmName, userId)?.let { user ->
            ResponseEntity.ok(user)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createUser(
        @PathVariable realmName: String,
        @RequestBody createUserRequest: CreateUserRequest
    ): ResponseEntity<UserDto> {
        return try {
            val createdUser = userService.createUser(realmName, createUserRequest)
            ResponseEntity.ok(createdUser)
        } catch (e: Exception) {
            ResponseEntity.badRequest().build()
        }
    }
}