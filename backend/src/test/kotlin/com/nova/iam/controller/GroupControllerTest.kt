package com.nova.iam.controller

import com.nova.iam.dto.CreateGroupRequest
import com.nova.iam.dto.GroupDto
import com.nova.iam.service.GroupService
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.http.HttpStatus
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull

@ExtendWith(MockitoExtension::class)
class GroupControllerTest {

    @Mock
    private lateinit var groupService: GroupService

    @InjectMocks
    private lateinit var groupController: GroupController

    @Test
    fun `should return groups when getGroups is called`() {
        // Given
        val realmName = "test-realm"
        val mockGroups = listOf(
            GroupDto(
                id = "group1",
                name = "Test Group 1",
                path = "/test-group-1",
                attributes = emptyMap()
            )
        )
        
        `when`(groupService.getGroups(realmName)).thenReturn(mockGroups)

        // When
        val response = groupController.getGroups(realmName)

        // Then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertNotNull(response.body)
        assertEquals(1, response.body!!.size)
        assertEquals("Test Group 1", response.body!![0].name)
    }

    @Test
    fun `should create group when valid request is provided`() {
        // Given
        val realmName = "test-realm"
        val createRequest = CreateGroupRequest(
            name = "New Group",
            path = "/new-group"
        )
        val createdGroup = GroupDto(
            id = "new-group-id",
            name = "New Group",
            path = "/new-group",
            attributes = emptyMap()
        )
        
        `when`(groupService.createGroup(realmName, createRequest)).thenReturn(createdGroup)

        // When
        val response = groupController.createGroup(realmName, createRequest)

        // Then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertNotNull(response.body)
        assertEquals("New Group", response.body!!.name)
    }

    @Test
    fun `should return not found when group does not exist`() {
        // Given
        val realmName = "test-realm"
        val groupId = "non-existent-group"
        
        `when`(groupService.getGroup(realmName, groupId)).thenReturn(null)

        // When
        val response = groupController.getGroup(realmName, groupId)

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
    }
}