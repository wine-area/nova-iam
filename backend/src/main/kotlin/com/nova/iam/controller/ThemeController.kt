package com.nova.iam.controller

import com.nova.iam.dto.ThemeConfigDto
import com.nova.iam.dto.ThemeListDto
import com.nova.iam.dto.ThemePreviewDto
import com.nova.iam.service.ThemeService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/themes")
@CrossOrigin(origins = ["http://localhost:8000", "http://localhost:3000"])
class ThemeController(
    private val themeService: ThemeService
) {

    @GetMapping
    fun listThemes(): ResponseEntity<List<ThemeListDto>> {
        return ResponseEntity.ok(themeService.listThemes())
    }

    @PostMapping("/preview")
    fun previewTheme(@RequestBody themeConfig: ThemeConfigDto): ResponseEntity<ThemePreviewDto> {
        val preview = themeService.generatePreview(themeConfig)
        return ResponseEntity.ok(preview)
    }

    @PostMapping
    fun createTheme(@RequestBody themeConfig: ThemeConfigDto): ResponseEntity<Map<String, String>> {
        val themeName = themeService.createTheme(themeConfig)
        return ResponseEntity.ok(mapOf(
            "themeName" to themeName,
            "message" to "Theme created and deployed successfully",
            "realmName" to themeConfig.realmName
        ))
    }

    @PostMapping("/{realmName}/deploy")
    fun deployTheme(
        @PathVariable realmName: String,
        @RequestBody themeConfig: ThemeConfigDto
    ): ResponseEntity<Map<String, String>> {
        val updatedConfig = themeConfig.copy(realmName = realmName)
        val themeName = themeService.createTheme(updatedConfig)
        return ResponseEntity.ok(mapOf(
            "themeName" to themeName,
            "message" to "Theme deployed successfully to realm $realmName",
            "realmName" to realmName
        ))
    }
}