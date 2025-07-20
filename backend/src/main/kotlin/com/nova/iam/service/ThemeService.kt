package com.nova.iam.service

import com.nova.iam.dto.ThemeConfigDto
import com.nova.iam.dto.ThemeListDto
import com.nova.iam.dto.ThemePreviewDto
import org.keycloak.admin.client.Keycloak
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*

@Service
class ThemeService(
    private val keycloak: Keycloak
) {
    
    private val logger = LoggerFactory.getLogger(ThemeService::class.java)
    
    @Value("\${keycloak.themes.path:./themes}")
    private lateinit var themesPath: String
    
    fun createTheme(themeConfig: ThemeConfigDto): String {
        logger.info("Creating theme for realm: ${themeConfig.realmName}")
        
        val themeName = themeConfig.themeName.ifBlank { 
            "nova-${themeConfig.realmName}-${System.currentTimeMillis()}" 
        }
        
        try {
            // Create theme directory structure
            val themeDir = createThemeDirectory(themeName)
            
            // Generate theme files
            generateThemeProperties(themeDir, themeConfig)
            generateLoginTemplate(themeDir, themeConfig)
            generateLoginPage(themeDir, themeConfig)
            generateCustomCss(themeDir, themeConfig)
            
            // Handle logo upload if provided
            if (!themeConfig.logoFile.isNullOrBlank()) {
                saveLogoFile(themeDir, themeConfig.logoFile)
            }
            
            // Update realm to use new theme
            updateRealmTheme(themeConfig.realmName, themeName)
            
            logger.info("Theme '$themeName' created successfully for realm '${themeConfig.realmName}'")
            return themeName
            
        } catch (e: Exception) {
            logger.error("Failed to create theme for realm ${themeConfig.realmName}", e)
            throw RuntimeException("Failed to create theme: ${e.message}", e)
        }
    }
    
    fun generatePreview(themeConfig: ThemeConfigDto): ThemePreviewDto {
        val templateContent = generateLoginTemplateContent(themeConfig)
        val cssContent = generateCssContent(themeConfig)
        return ThemePreviewDto(templateContent, cssContent)
    }
    
    fun listThemes(): List<ThemeListDto> {
        val themes = mutableListOf<ThemeListDto>()
        
        try {
            val themesDir = File(themesPath)
            if (themesDir.exists() && themesDir.isDirectory) {
                themesDir.listFiles()?.forEach { themeDir ->
                    if (themeDir.isDirectory && themeDir.name.startsWith("nova-")) {
                        themes.add(ThemeListDto(
                            name = themeDir.name,
                            displayName = themeDir.name.replace("nova-", "").replace("-", " ")
                                .replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
                        ))
                    }
                }
            }
        } catch (e: Exception) {
            logger.warn("Failed to list themes", e)
        }
        
        return themes
    }
    
    private fun createThemeDirectory(themeName: String): Path {
        val themeDir = Paths.get(themesPath, themeName)
        val loginDir = themeDir.resolve("login")
        val resourcesDir = loginDir.resolve("resources")
        val cssDir = resourcesDir.resolve("css")
        val imgDir = resourcesDir.resolve("img")
        
        Files.createDirectories(cssDir)
        Files.createDirectories(imgDir)
        
        return themeDir
    }
    
    private fun generateThemeProperties(themeDir: Path, config: ThemeConfigDto) {
        val properties = """
            parent=keycloak
            import=common/keycloak
            
            styles=css/login.css css/custom.css
            
            # Custom properties
            primaryColor=${config.primaryColor ?: "#1890ff"}
            backgroundColor=${config.backgroundColor ?: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
            logoUrl=${config.logoUrl ?: ""}
        """.trimIndent()
        
        Files.write(themeDir.resolve("theme.properties"), properties.toByteArray())
    }
    
    private fun generateLoginTemplate(themeDir: Path, config: ThemeConfigDto) {
        val templateContent = generateLoginTemplateContent(config)
        Files.write(themeDir.resolve("login/template.ftl"), templateContent.toByteArray())
    }
    
    private fun generateLoginPage(themeDir: Path, config: ThemeConfigDto) {
        val loginPageContent = javaClass.getResourceAsStream("/templates/login.ftl")?.use { 
            it.readAllBytes() 
        } ?: throw RuntimeException("Login template not found")
        
        Files.write(themeDir.resolve("login/login.ftl"), loginPageContent)
    }
    
    private fun generateCustomCss(themeDir: Path, config: ThemeConfigDto) {
        val cssContent = generateCssContent(config)
        Files.write(themeDir.resolve("login/resources/css/custom.css"), cssContent.toByteArray())
    }
    
    private fun generateLoginTemplateContent(config: ThemeConfigDto): String {
        return javaClass.getResourceAsStream("/templates/template.ftl")?.use { 
            String(it.readAllBytes())
        } ?: throw RuntimeException("Template file not found")
    }
    
    private fun generateCssContent(config: ThemeConfigDto): String {
        return """
            /* Custom Nova IAM Theme CSS */
            .login-pf body {
                background: ${config.backgroundColor ?: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .card-pf {
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                border: none;
            }
            
            .btn-primary {
                background-color: ${config.primaryColor ?: "#1890ff"};
                border-color: ${config.primaryColor ?: "#1890ff"};
                border-radius: 6px;
                padding: 10px 20px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .btn-primary:hover,
            .btn-primary:focus,
            .btn-primary:active {
                background-color: ${config.primaryColor ?: "#1890ff"};
                border-color: ${config.primaryColor ?: "#1890ff"};
                opacity: 0.8;
                transform: translateY(-1px);
            }
            
            .form-control {
                border-radius: 6px;
                border: 1px solid #d9d9d9;
                padding: 10px 12px;
                transition: border-color 0.3s ease;
            }
            
            .form-control:focus {
                border-color: ${config.primaryColor ?: "#1890ff"};
                box-shadow: 0 0 0 2px ${config.primaryColor ?: "#1890ff"}20;
            }
            
            ${if (!config.logoUrl.isNullOrBlank()) """
            .kc-logo-text {
                background-image: url('${config.logoUrl}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                text-indent: -9999px;
                height: 60px;
                width: 200px;
                margin: 0 auto;
            }
            """ else ""}
            
            ${config.customCss ?: ""}
        """.trimIndent()
    }
    
    private fun saveLogoFile(themeDir: Path, logoBase64: String) {
        try {
            val logoData = Base64.getDecoder().decode(logoBase64.split(",").last())
            Files.write(themeDir.resolve("login/resources/img/logo.png"), logoData)
        } catch (e: Exception) {
            logger.warn("Failed to save logo file", e)
        }
    }
    
    private fun updateRealmTheme(realmName: String, themeName: String) {
        try {
            val realm = keycloak.realm(realmName).toRepresentation()
            realm.loginTheme = themeName
            keycloak.realm(realmName).update(realm)
            logger.info("Updated realm '$realmName' to use theme '$themeName'")
        } catch (e: Exception) {
            logger.error("Failed to update realm theme", e)
            throw RuntimeException("Failed to update realm theme: ${e.message}", e)
        }
    }
}