# Nova IAM Project

A comprehensive Identity and Access Management (IAM) system built with Keycloak, featuring a modern management console and visual theme designer.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd nova-iam
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the applications:
- **Keycloak Admin Console**: http://localhost:8080/admin (admin/admin)
- **Nova IAM Frontend**: http://localhost:8000
- **Nova IAM Backend API**: http://localhost:8090

### Local Development

#### Backend (Kotlin Spring Boot)
```bash
cd backend
./gradlew bootRun
```

#### Frontend (Ant Design Pro)
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
nova-iam/
├── backend/                 # Kotlin Spring Boot BFF
│   ├── src/main/kotlin/
│   │   └── com/nova/iam/
│   │       ├── controller/   # REST Controllers
│   │       ├── service/      # Business Logic
│   │       ├── dto/          # Data Transfer Objects
│   │       └── config/       # Configuration
│   └── build.gradle.kts
├── frontend/                # Ant Design Pro React App
│   ├── src/
│   │   ├── pages/           # Page Components
│   │   ├── services/        # API Services
│   │   └── components/      # Reusable Components
│   └── package.json
├── themes/                  # Keycloak Custom Themes
├── docker-compose.yml       # Multi-service deployment
└── README.md
```

## Features

### Phase 1 (Completed)
- ✅ Basic environment setup with Docker Compose
- ✅ Keycloak deployment with PostgreSQL
- ✅ Kotlin Spring Boot backend with Keycloak Admin Client
- ✅ Ant Design Pro frontend
- ✅ Core APIs for Realm and User management
- ✅ Basic CRUD operations for Realms and Users

### Phase 2 (Planned)
- 🔲 Visual login theme designer
- 🔲 Theme generation and deployment pipeline
- 🔲 Custom FreeMarker templates

### Phase 3 (Planned)
- 🔲 Micro-frontend architecture with Qiankun
- 🔲 Sub-application integration
- 🔲 Token sharing mechanism

### Phase 4 (Planned)
- 🔲 Advanced IAM features
- 🔲 Security hardening
- 🔲 Production deployment configuration

## API Endpoints

### Realm Management
- `GET /api/realms` - List all realms
- `GET /api/realms/{realmName}` - Get specific realm
- `POST /api/realms` - Create new realm

### User Management
- `GET /api/realms/{realmName}/users` - List users in realm
- `GET /api/realms/{realmName}/users/{userId}` - Get specific user
- `POST /api/realms/{realmName}/users` - Create new user

## Development

### Backend Testing
```bash
cd backend
./gradlew test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Building for Production
```bash
# Build all services
docker-compose build

# Build individual services
docker build -t nova-iam-backend ./backend
docker build -t nova-iam-frontend ./frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.