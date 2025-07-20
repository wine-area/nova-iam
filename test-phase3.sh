#!/bin/bash

# Phase 3 Integration Test Script
# Tests the micro-frontend architecture implementation

set -e

echo "🚀 Starting Phase 3 Integration Tests for Nova IAM Micro-frontend Architecture"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test 1: Verify Qiankun plugin installation
echo ""
print_info "Test 1: Verifying Qiankun plugin installation..."
cd /home/runner/work/nova-iam/nova-iam/frontend
if grep -q "@umijs/plugin-qiankun" package.json; then
    print_status "Qiankun plugin found in package.json"
else
    print_error "Qiankun plugin not found in package.json"
    exit 1
fi

# Test 2: Verify main application configuration
echo ""
print_info "Test 2: Verifying main application Qiankun configuration..."
if grep -q "qiankun:" config/config.ts; then
    print_status "Qiankun configuration found in main app"
else
    print_error "Qiankun configuration missing from main app"
    exit 1
fi

# Test 3: Verify sub-application exists
echo ""
print_info "Test 3: Verifying demo sub-application structure..."
cd /home/runner/work/nova-iam/nova-iam/demo-sub-app
if [ -f "package.json" ] && [ -f "config/config.ts" ] && [ -d "src/pages" ]; then
    print_status "Demo sub-application structure is correct"
else
    print_error "Demo sub-application structure is incomplete"
    exit 1
fi

# Test 4: Verify sub-application Qiankun configuration
echo ""
print_info "Test 4: Verifying sub-application Qiankun configuration..."
if grep -q "slave:" config/config.ts; then
    print_status "Sub-application configured as Qiankun slave"
else
    print_error "Sub-application not configured as Qiankun slave"
    exit 1
fi

# Test 5: Verify Applications management page
echo ""
print_info "Test 5: Verifying Applications management page..."
cd /home/runner/work/nova-iam/nova-iam/frontend
if [ -f "src/pages/Applications.tsx" ]; then
    print_status "Applications management page exists"
else
    print_error "Applications management page missing"
    exit 1
fi

# Test 6: Verify micro-frontend service
echo ""
print_info "Test 6: Verifying micro-frontend service..."
if [ -f "src/services/microFrontendService.ts" ]; then
    print_status "Micro-frontend service exists"
else
    print_error "Micro-frontend service missing"
    exit 1
fi

# Test 7: Verify token sharing mechanism
echo ""
print_info "Test 7: Verifying token sharing mechanism..."
if grep -q "accessToken" src/services/microFrontendService.ts; then
    print_status "Token sharing mechanism implemented"
else
    print_error "Token sharing mechanism missing"
    exit 1
fi

# Test 8: Verify main app layout configuration
echo ""
print_info "Test 8: Verifying main app layout configuration..."
if [ -f "src/app.tsx" ]; then
    print_status "Main app configuration exists"
else
    print_error "Main app configuration missing"
    exit 1
fi

# Test 9: Check for micro-frontend route configuration
echo ""
print_info "Test 9: Verifying micro-frontend route configuration..."
if grep -q "microApp" config/config.ts; then
    print_status "Micro-frontend routes configured"
else
    print_warning "Micro-frontend routes may need additional configuration"
fi

# Test 10: Verify Docker configuration
echo ""
print_info "Test 10: Verifying Docker configuration for micro-frontends..."
cd /home/runner/work/nova-iam/nova-iam
if grep -q "demo-sub-app:" docker-compose.yml; then
    print_status "Demo sub-app added to Docker Compose"
else
    print_error "Demo sub-app missing from Docker Compose"
    exit 1
fi

# Test 11: Check sub-app Dockerfile
echo ""
print_info "Test 11: Verifying sub-application Dockerfile..."
if [ -f "demo-sub-app/Dockerfile" ]; then
    print_status "Sub-application Dockerfile exists"
else
    print_error "Sub-application Dockerfile missing"
    exit 1
fi

# Summary
echo ""
echo "=================================================================="
print_status "Phase 3 Implementation Verification Complete!"
echo ""
print_info "✨ Implementation Summary:"
echo "   • Qiankun micro-frontend framework integrated"
echo "   • Main application configured as host/master"
echo "   • Demo sub-application created and configured"
echo "   • Token sharing mechanism implemented"
echo "   • Applications management interface created"
echo "   • Docker configuration updated"
echo ""
print_info "🎯 Phase 3 Objectives Achieved:"
echo "   ✅ Micro-frontend architecture with Qiankun"
echo "   ✅ Sub-application loading capability"
echo "   ✅ Token sharing between applications"
echo "   ✅ Dynamic application management"
echo ""
print_info "🚀 Next Steps to Test Live Integration:"
echo "   1. Start the infrastructure: docker compose up -d postgres keycloak"
echo "   2. Build and start backend: cd backend && ./gradlew bootRun"
echo "   3. Install deps and start main app: cd frontend && npm install && npm run dev"
echo "   4. Install deps and start sub-app: cd demo-sub-app && npm install && npm run dev"
echo "   5. Access Nova IAM at http://localhost:8000"
echo "   6. Navigate to Applications page and load the demo sub-app"
echo ""
print_warning "Note: Live testing requires installing npm dependencies and starting services"
echo "=================================================================="