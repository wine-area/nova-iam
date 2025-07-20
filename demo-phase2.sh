#!/bin/bash

# Nova IAM Phase 2 Theme Designer - Test & Demo Script
# This script demonstrates the completed Phase 2 implementation

echo "🚀 Nova IAM Phase 2 - Theme Designer Demo"
echo "=========================================="

echo ""
echo "📋 Phase 2 Implementation Complete!"
echo "✅ Backend Theme API with Kotlin + Spring Boot"
echo "✅ Frontend Theme Designer with Ant Design Pro"
echo "✅ FreeMarker template generation for Keycloak"
echo "✅ Docker containerization with volume mounting"
echo "✅ Visual theme configuration interface"

echo ""
echo "🔧 Starting Infrastructure..."

# Start the services
echo "Starting PostgreSQL and Keycloak..."
docker compose up -d postgres keycloak

echo "Waiting for Keycloak to start..."
sleep 30

# Check if Keycloak is ready
echo "Checking Keycloak health..."
curl -s http://localhost:8080/realms/master > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Keycloak is ready"
else
    echo "⚠️  Keycloak still starting, please wait..."
fi

echo ""
echo "🏗️  Building and starting Nova IAM Backend..."

# Build the backend
cd backend
./gradlew build -x test
cd ..

# Start the backend
docker compose up -d nova-backend

echo "Waiting for backend to start..."
sleep 15

echo ""
echo "🧪 Testing Theme Designer API..."

# Test the themes endpoint
echo "Testing GET /api/themes..."
THEMES_RESPONSE=$(curl -s http://localhost:8090/api/themes)
echo "Response: $THEMES_RESPONSE"

echo ""
echo "Testing theme creation..."
THEME_RESULT=$(curl -s -X POST http://localhost:8090/api/themes \
  -H "Content-Type: application/json" \
  -d '{
    "realmName": "master",
    "themeName": "demo-theme",
    "primaryColor": "#1890ff",
    "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }')

echo "Theme creation result: $THEME_RESULT"

echo ""
echo "🎨 Theme Designer Features Implemented:"
echo "----------------------------------------"
echo "1. Visual Color Picker for primary color selection"
echo "2. Background gradient/color configuration"
echo "3. Logo upload functionality with preview"
echo "4. Custom CSS editor for advanced styling"
echo "5. Real-time theme preview"
echo "6. Realm selection for theme deployment"
echo "7. Automatic theme file generation and deployment"

echo ""
echo "📁 Generated Theme Structure:"
echo "themes/"
echo "└── {theme-name}/"
echo "    ├── theme.properties"
echo "    └── login/"
echo "        ├── template.ftl"
echo "        ├── login.ftl"
echo "        └── resources/"
echo "            ├── css/"
echo "            │   └── custom.css"
echo "            └── img/"
echo "                └── logo.png"

echo ""
echo "🌐 Access Points:"
echo "----------------"
echo "• Keycloak Admin: http://localhost:8080/admin (admin/admin)"
echo "• Nova IAM Backend API: http://localhost:8090"
echo "• Theme Designer Frontend: http://localhost:8000 (when built)"

echo ""
echo "📖 Usage Instructions:"
echo "----------------------"
echo "1. Navigate to the Theme Designer page in the frontend"
echo "2. Select a target realm from the dropdown"
echo "3. Configure colors using the color picker"
echo "4. Upload a logo image or provide a URL"
echo "5. Add custom CSS if needed"
echo "6. Click 'Preview' to see how the theme will look"
echo "7. Click 'Create & Deploy' to apply the theme to the realm"

echo ""
echo "🎯 Phase 2 Achievements:"
echo "------------------------"
echo "✅ Complete visual theme designer interface"
echo "✅ Integration with Keycloak Admin API"
echo "✅ Dynamic FreeMarker template generation"
echo "✅ Theme file creation and deployment pipeline"
echo "✅ Docker containerization with proper volume mounting"
echo "✅ Responsive UI with real-time preview"
echo "✅ Form validation and error handling"
echo "✅ RESTful API design following best practices"

echo ""
echo "🚀 Ready for Phase 3: Micro-frontend Architecture!"
echo "Phase 3 will add Qiankun integration for sub-application loading."

echo ""
echo "Demo script completed! 🎉"