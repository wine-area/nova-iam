### 项目总览 (Project Overview)

**项目名称:** `Nova IAM` - 新一代动态身份管理与应用门户平台

**核心目标:**
1.  构建一个基于 Keycloak 的、功能强大的身份与访问管理 (IAM) 系统。
2.  提供一个使用 Ant Design Pro 开发的、现代化的**管理控制台**，取代 Keycloak 的原生后台。
3.  在管理控制台中内置一个**登录页面可视化编辑器**，允许管理员为不同 Realm 在线设计登录页，并一键部署。
4.  实现一个**微前端应用门户**，让所有受 Keycloak保护的业务应用 (Clients) 都能作为子应用无缝集成到主控制台（父应用）中，提供统一的用户体验。

### 核心架构决策与解读

#### 1. "在前端自定义登录界面" 的实现机制

这是一个关键点。您**不能**直接用 React (Ant Design Pro) 来渲染 Keycloak 的登录页，因为登录这个动作发生在 Keycloak 的域下，而不是您的应用域下。

**正确方案是：**
在您的 Ant Design Pro 管理后台中，创建一个**“主题设计器”**页面。这个页面提供UI控件（如颜色选择器、图片上传器、布局选项等），让管理员进行可视化配置。当管理员点击“保存并部署”时：

1.  **前端 (AntD Pro):** 将用户的设计（例如 `{ "logo": "...", "primaryColor": "#FF0000", "backgroundImage": "..." }`）作为 JSON 数据发送到您的后端。
2.  **后端 (Kotlin):** 接收到这个 JSON。它有一个预设的 **FreeMarker 模板 (`login.ftl`)**。后端服务会动态地将这些 JSON 值**注入**到模板中，或者生成一个新的 CSS 文件。
3.  **后端 (Kotlin):** 将生成好的完整主题文件（`login.ftl`, `theme.properties`, `resources/css/style.css`, `resources/img/logo.png` 等）打包成一个目录结构。
4.  **后端 (Kotlin):** 通过两种方式部署主题：
    *   **文件系统挂载 (推荐):** 如果后端服务和 Keycloak 共享一个持久化卷 (Volume)，可以直接将生成的主题文件写入到 Keycloak 的 `themes` 目录下。这是最稳定和高效的方式。
    *   **远程部署 (备选):** 如果是分离部署，后端需要有权限（例如通过 SSH/SFTP）将文件包推送到 Keycloak 服务器的 `themes` 目录。
5.  **后端 (Kotlin):** 调用 `Keycloak Admin API`，将指定 Realm 的 `loginTheme` 属性设置为刚刚部署的主题名称。

这样，就实现了“在前端设计，自动部署为 Realm 登录页”的闭环。

#### 2. 微前端架构选择

我们将采用 **Qiankun**，这是一个成熟且被广泛使用的微前端框架，与 Ant Design Pro 社区结合紧密。

*   **主应用 (Host):** 您的 Ant Design Pro 管理控制台。它负责整体布局、菜单、路由，并作为基座来加载各个子应用。
*   **子应用 (Micro App):** 每一个需要被集成的业务系统 (Keycloak Client)。它们可以独立开发、独立部署，技术栈不限（虽然统一技术栈更易于管理）。

### 技术栈选型 (Technology Stack)

*   **IAM 核心:** Keycloak
*   **后端 BFF:** Kotlin + Spring Boot
*   **前端主应用:** Ant Design Pro (React, UmiJS)
*   **微前端框架:** Qiankun
*   **数据库 (可选):** PostgreSQL/MySQL (用于您的后端服务自身的业务数据，如审计日志)
*   **部署:** Docker & Docker Compose (本地开发), Kubernetes (生产环境)

### 整体架构图

```
+-----------------------------------------------------------------------------------+
|                                 用户 (管理员/普通用户)                              |
+-----------------------------------------------------------------------------------+
      |                                        |                                  |
      | 1. 访问管理后台/业务应用                 | 2. 访问需要登录的应用              |
      v                                        v                                  |
+--------------------------+         +---------------------+                      |
|   浏览器                 |         | Keycloak 服务器     |                      |
| +----------------------+ |         | +-----------------+ |                      |
| | AntD Pro 主应用      | |         | | Realm A         | |                      |
| | (Qiankun Host)       | +---------> | | 自定义登录主题A | |                      |
| |----------------------| | 登录请求  | +---------------+ |                      |
| | | 子应用A (React)  | | |         | | Realm B         | |                      |
| | | 子应用B (Vue)    | | |         | | 自定义登录主题B | |                      |
| +----------------------+ |         | +---------------+ |                      |
+--------------------------+         +---------------------+                      |
      ^       ^       |                                  ^                        |
      |       |       | 3. API 请求 (管理操作)             | 5. 主题部署与API调用     |
      |       |       v                                  |                        |
      |       +---------------->+------------------------+                        |
      |                         |   后端 BFF (Kotlin)    |                        |
      |                         |------------------------|                        |
      | 4. Token 验证           | Keycloak Admin Client  |------------------------+
      |                         | 主题生成与部署逻辑     |   6. Admin API 调用
      |                         +------------------------+
      +--------------------------------------------------+
        (子应用加载后，API请求携带Token直接访问各自的后端)

```
**流程解读:**
1.  用户访问主应用。主应用本身也是一个 Keycloak Client，用户首先需要在主应用登录。
2.  如果用户访问某个需要认证的页面或子应用，会被重定向到 Keycloak。
3.  Keycloak 根据当前访问的 Realm，加载并显示对应的自定义登录主题。
4.  管理员在主应用中进行管理操作（如创建用户、设计主题），请求被发送到 Kotlin 后端。
5.  后端处理请求，如果是主题设计，则生成主题文件并部署到 Keycloak 的 themes 目录。
6.  后端调用 Keycloak Admin API 完成具体操作（如创建用户、更新 Realm 的主题设置）。

---

### 详细项目实施规划 (Phased Implementation Plan)

#### Phase 1: 基础环境与核心后端搭建 (1-2周)

*   **目标:** 跑通核心技术栈，搭建开发环境。
*   **任务:**
    1.  **Keycloak 部署:** 使用 Docker Compose 部署 Keycloak，并创建初始的 `master` 管理员。将 `themes` 和 `data` 目录挂载出来用于持久化。
    2.  **后端项目初始化:** 创建 Kotlin + Spring Boot 项目，集成 `keycloak-admin-client`。
    3.  **配置连接:** 在后端 `application.yml` 中配置好 Keycloak 的连接信息。
    4.  **实现核心 API:**
        *   `GET /api/realms`: 获取所有 Realm 列表。
        *   `POST /api/realms`: 创建一个新的 Realm。
        *   `GET /api/realms/{realmName}/users`: 获取指定 Realm 的用户列表。
        *   `POST /api/realms/{realmName}/users`: 在指定 Realm 创建一个新用户。
    5.  **前端项目初始化:** 使用 `create-umi` 初始化 Ant Design Pro 项目。
    6.  **打通前后端:** 在 AntD Pro 中创建一个简单的 Realm 列表页面，调用后端 API `GET /api/realms` 并展示数据。配置好代理解决跨域问题。

#### Phase 2: 登录主题设计器与部署流水线 (2-3周)

*   **目标:** 实现项目的核心亮点功能——在线主题设计与部署。
*   **任务:**
    1.  **后端主题模板化:**
        *   在后端项目中创建基础的 `login.ftl` 和 `theme.properties` 模板。
        *   设计一个数据结构（DTO），如 `ThemeConfigDto`，用于接收前端的设计参数。
        *   编写 `ThemeGeneratorService`，该服务能根据 `ThemeConfigDto` 动态生成完整的主题文件包（替换 CSS 变量、拷贝 logo 等）。
    2.  **后端部署逻辑:**
        *   实现文件写入逻辑，将生成的主题包写入到与 Keycloak 共享的 `themes` 目录下。
        *   创建 API `POST /api/realms/{realmName}/theme`，它接收 `ThemeConfigDto`，调用 `ThemeGeneratorService`，然后调用 Keycloak Admin API 设置该 Realm 的 `loginTheme`。
    3.  **前端主题设计器 UI:**
        *   在 AntD Pro 中创建一个新页面 `/theme-designer`。
        *   使用 AntD 组件（`ColorPicker`, `Upload`, `Input`, `Select`）构建一个表单，让管理员可以配置主题。
        *   表单提交时，调用后端的 `POST /api/realms/{realmName}/theme` 接口。
    4.  **端到端测试:** 在 UI 上设计一个主题 -> 保存 -> 检查 Keycloak 服务器上是否生成了新文件 -> 检查 Realm 设置是否已更新 -> 打开该 Realm 的登录页，验证新主题是否生效。

#### Phase 3: 微前端架构集成 (2-3周)

*   **目标:** 将 AntD Pro 改造为基座应用，并成功集成第一个微前端子应用。
*   **任务:**
    1.  **主应用改造 (AntD Pro):**
        *   安装 `@umijs/plugin-qiankun`。
        *   在主应用的配置文件 (`config/config.ts`) 中注册子应用信息，包括名称、入口地址 (entry) 和激活规则 (activeRule)。
        *   改造主应用的布局，为子应用提供一个渲染容器 `div`。
    2.  **创建第一个子应用:**
        *   可以是一个简单的 React/Vue 应用，也可以是另一个 AntD Pro 项目。
        *   按照 Qiankun 的要求，修改子应用的入口文件，导出 `bootstrap`, `mount`, `unmount` 生命周期钩子。
        *   配置子应用的 Webpack，以支持跨域和 UMD (Universal Module Definition) 打包格式。
    3.  **认证与授权:**
        *   主应用和所有子应用都应被配置为 Keycloak 的 **Public Clients**（如果前后端分离）或 **Confidential Clients**（如果有后端）。
        *   **登录流程:** 用户在主应用登录后，主应用获取 `access_token`。
        *   **Token 共享:** 主应用通过 qiankun 的 `props` 机制将 `access_token` 和用户信息传递给子应用。
        *   **API 请求:** 子应用在向其自己的后端服务发起 API 请求时，必须在 `Authorization` header 中携带从主应用获取的 `access_token`。
    4.  **测试集成:** 验证用户可以在主应用中通过菜单点击，无刷新地加载、渲染和卸载子应用。验证子应用可以成功获取 token 并调用其后端 API。

#### Phase 4: 功能完善与生产环境准备 (1-2周)

*   **目标:** 完善管理功能，并为上线做准备。
*   **任务:**
    1.  **完善 IAM 管理功能:** 在 AntD Pro 中继续开发其他管理页面，如：
        *   客户端管理 (Client Management)
        *   角色管理 (Role Management)
        *   用户组 (Groups)
        *   身份提供者 (Identity Providers)
    2.  **安全性加固:**
        *   为 Kotlin 后端 API 添加权限校验，确保只有特定角色的管理员才能调用。
        *   对所有用户输入进行严格的校验和清理。
    3.  **CI/CD 流程:**
        *   为前端和后端项目编写 Dockerfile。
        *   建立 CI/CD 流水线 (e.g., using GitHub Actions, Jenkins)，实现自动化测试、构建 Docker 镜像和部署。
    4.  **文档:** 编写管理员使用手册和开发者文档。

### 风险与应对策略

*   **风险:** Keycloak 主题机制的学习曲线。
    *   **应对:** 在项目早期集中攻克，参考官方文档和社区的优秀主题案例。先实现简单的 CSS 替换，再逐步实现复杂的模板修改。
*   **风险:** 微前端集成复杂性，尤其是在认证和样式隔离方面。
    *   **应对:** 严格遵循 Qiankun 的最佳实践。早期就确定 Token 传递机制。使用 CSS Modules 或其他方案避免样式冲突。
*   **风险:** 开发工作量巨大，需要完整复刻 Keycloak 的所有管理功能。
    *   **应对:** 采用敏捷开发，按优先级实现功能。初期只实现最高频、最重要的功能（如用户、Realm管理和主题设计），其他低频功能可以暂时引导管理员到 Keycloak 原生后台操作，作为过渡方案。

这个规划为您提供了一个清晰的、可执行的路线图。祝您项目顺利！
