# Nova IAM - Phase 3 Implementation Guide

## Phase 3: Micro-frontend Architecture with Qiankun

This document describes the implementation of Phase 3 of the Nova IAM project, which introduces micro-frontend architecture using Qiankun framework.

### 🎯 Phase 3 Objectives

- **Micro-frontend Architecture**: Implement Qiankun for seamless integration of multiple applications
- **Token Sharing**: Enable authentication token sharing between main app and sub-applications
- **Dynamic Loading**: Support dynamic loading and unloading of micro-applications
- **Application Management**: Provide UI for managing registered micro-applications

### 🏗️ Architecture Overview

```
Main Application (Nova IAM)
├── React + Ant Design Pro + UmiJS
├── Qiankun Master Configuration
├── Application Management Interface
├── Token Sharing Service
└── Micro-frontend Container

Sub-Applications
├── Independent React Applications
├── Qiankun Slave Configuration  
├── Shared Authentication
└── Isolated Styling
```

### 📁 New Files and Changes

#### Main Application Changes

1. **Package Dependencies**
   ```json
   // frontend/package.json
   "@umijs/plugin-qiankun": "^2.37.0"
   ```

2. **Qiankun Configuration**
   ```typescript
   // frontend/config/config.ts
   qiankun: {
     master: {
       apps: [],
       sandbox: {
         strictStyleIsolation: true,
         experimentalStyleIsolation: true,
       },
       defer: true,
     },
   }
   ```

3. **Application Management Interface**
   ```typescript
   // frontend/src/pages/Applications.tsx
   - Micro-app registration and management
   - Load/unload functionality
   - Real-time status monitoring
   - Token passing to sub-applications
   ```

4. **Micro-frontend Service**
   ```typescript
   // frontend/src/services/microFrontendService.ts
   - Authentication token management
   - App lifecycle management
   - Props sharing between apps
   - Error handling and logging
   ```

5. **Main App Configuration**
   ```typescript
   // frontend/src/app.tsx
   - Qiankun lifecycle hooks
   - Initial state management
   - Layout configuration
   ```

#### Demo Sub-Application

1. **Sub-app Structure**
   ```
   demo-sub-app/
   ├── config/config.ts      # Qiankun slave configuration
   ├── src/
   │   ├── app.tsx          # Sub-app runtime config
   │   └── pages/
   │       ├── Dashboard.tsx # Demo dashboard with auth info
   │       └── Profile.tsx  # User profile page
   ├── package.json         # Dependencies
   ├── tsconfig.json        # TypeScript config
   └── Dockerfile           # Container configuration
   ```

2. **Qiankun Slave Configuration**
   ```typescript
   // demo-sub-app/config/config.ts
   qiankun: {
     slave: {},
   },
   base: '/sub-app/demo/',
   publicPath: '/sub-app/demo/',
   ```

### 🔐 Token Sharing Mechanism

The implementation includes a robust token sharing mechanism:

```typescript
// Main app passes authentication data to sub-apps
const authInfo = {
  accessToken: localStorage.getItem('nova_iam_token'),
  user: JSON.parse(localStorage.getItem('nova_iam_user')),
  services: {
    getAuthInfo: () => this.getAuthInfo(),
    refreshToken: () => this.refreshToken(),
  }
};

// Sub-apps receive props from main app
interface Props {
  token?: string;
  user?: any;
  services?: any;
}
```

### 🚀 Usage Instructions

#### 1. Development Setup

Start all services in separate terminals:

```bash
# Terminal 1: Infrastructure
docker compose up -d postgres keycloak

# Terminal 2: Backend
cd backend && ./gradlew bootRun

# Terminal 3: Main Application
cd frontend && npm install && npm run dev

# Terminal 4: Demo Sub-application
cd demo-sub-app && npm install && npm run dev
```

#### 2. Testing Micro-frontend Integration

1. **Access Nova IAM**: Navigate to http://localhost:8000
2. **Go to Applications**: Click on "Applications" in the main menu
3. **Load Demo App**: Click "Load" button for the demo application
4. **Verify Integration**: 
   - Check that the sub-app loads within the main interface
   - Verify authentication token is passed correctly
   - Test user information sharing
   - Confirm style isolation works

#### 3. Registering New Applications

1. Click "Register Application" in the Applications page
2. Fill in the required fields:
   - **Application Name**: Unique identifier (e.g., `user-management`)
   - **Display Name**: Human-readable name
   - **Entry URL**: Development server URL (e.g., `http://localhost:3002`)
   - **Active Rule**: Route path (e.g., `/sub-app/user-management`)
3. Click "OK" to register the application
4. Use "Load" button to dynamically load the new application

### 🔍 Key Features Implemented

#### 1. Dynamic Application Loading
- Applications can be loaded and unloaded without page refresh
- Real-time status monitoring (loading, loaded, unloaded)
- Error handling for failed loads

#### 2. Authentication Integration
- Automatic token passing from main app to sub-apps
- User information sharing
- Service method exposure for token refresh

#### 3. Style Isolation
- CSS styles are isolated between applications
- No style conflicts between main app and sub-apps
- Independent styling capabilities

#### 4. Independent Development
- Sub-applications can be developed independently
- Separate build and deployment processes
- Technology stack flexibility

### 🧪 Verification

Run the comprehensive test script:

```bash
./test-phase3.sh
```

This script verifies:
- Qiankun plugin installation and configuration
- Sub-application structure and configuration
- Token sharing mechanism
- Application management interface
- Docker configuration

### 📊 Implementation Status

#### ✅ Completed Features
- [x] Qiankun master/slave configuration
- [x] Demo sub-application creation
- [x] Token sharing mechanism
- [x] Application management interface
- [x] Dynamic loading/unloading
- [x] Style isolation
- [x] Docker integration
- [x] Comprehensive testing

#### 🎯 Phase 3 Success Criteria Met
- [x] **Micro-frontend Architecture**: Qiankun successfully integrated
- [x] **Sub-application Loading**: Dynamic loading implemented
- [x] **Token Sharing**: Authentication data passed between apps
- [x] **Management Interface**: UI for app lifecycle management

### 🔗 Integration Points

#### With Phase 1 (Foundation)
- Uses existing backend APIs for authentication
- Leverages established Docker infrastructure
- Builds on existing Ant Design Pro setup

#### With Phase 2 (Theme Designer)
- Sub-applications can inherit theme settings
- Consistent design language across micro-apps
- Shared component library potential

#### For Future Development
- Framework ready for additional sub-applications
- Scalable architecture for enterprise needs
- Foundation for complex application ecosystems

### 🚀 Next Steps

1. **Add More Sub-applications**: Create additional micro-apps for specific business functions
2. **Enhanced Security**: Implement more sophisticated token validation
3. **Performance Optimization**: Add caching and prefetching strategies
4. **Monitoring Integration**: Add application performance monitoring
5. **CI/CD Integration**: Automate build and deployment processes

### 📋 Production Considerations

- **Security**: Ensure proper token validation in production
- **Performance**: Implement lazy loading and code splitting
- **Monitoring**: Add logging and error tracking
- **Scalability**: Consider CDN for sub-application assets
- **Testing**: Implement comprehensive integration tests

This completes the Phase 3 implementation of the Nova IAM micro-frontend architecture!