package com.nova.iam.dto

data class ThemeConfigDto(
    val realmName: String,
    val themeName: String,
    val primaryColor: String? = null,
    val backgroundColor: String? = null,
    val logoUrl: String? = null,
    val logoFile: String? = null, // Base64 encoded image data
    val customCss: String? = null
)

data class ThemePreviewDto(
    val templateHtml: String,
    val cssContent: String
)

data class ThemeListDto(
    val name: String,
    val displayName: String,
    val preview: String? = null
)