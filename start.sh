#!/bin/bash

# 🚀 Descuentia Dev Server Starter
# Starts all development servers concurrently

echo "🚀 Starting Descuentia Development Servers..."
echo ""

# Check if node_modules exist in each directory
check_dependencies() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        echo "⚠️  $name dependencies not installed. Run 'npm install' in $dir"
        return 1
    fi
    return 0
}

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check dependencies
echo "🔍 Checking dependencies..."
check_dependencies "backend" "Backend" && BACKEND_OK=1 || BACKEND_OK=0
check_dependencies "website" "Website" && WEBSITE_OK=1 || WEBSITE_OK=0
check_dependencies "mobile-app" "Mobile App" && MOBILE_OK=1 || MOBILE_OK=0

echo ""

# Start servers
if [ $BACKEND_OK -eq 1 ] && [ $WEBSITE_OK -eq 1 ] && [ $MOBILE_OK -eq 1 ]; then
    echo "✅ All dependencies found. Starting servers..."
    echo ""
    echo -e "${GREEN}📡 Backend API${NC} - ${BLUE}http://localhost:3001${NC}"
    echo -e "${GREEN}🌐 Website${NC} - ${BLUE}http://localhost:3000${NC}"
    echo -e "${GREEN}📱 Mobile App${NC} - Expo Dev Server"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    echo ""
    
    # Start all servers in background with proper naming
    (cd backend && npm run dev) 2>&1 | sed "s/^/[${GREEN}BACKEND${NC}] /" &
    BACKEND_PID=$!
    
    (cd website && npm run dev) 2>&1 | sed "s/^/[${YELLOW}WEBSITE${NC}] /" &
    WEBSITE_PID=$!
    
    (cd mobile-app && npm start) 2>&1 | sed "s/^/[${BLUE}MOBILE${NC}] /" &
    MOBILE_PID=$!
    
    # Trap Ctrl+C and kill all background processes
    trap "echo ''; echo '🛑 Stopping all servers...'; kill $BACKEND_PID $WEBSITE_PID $MOBILE_PID 2>/dev/null; exit" INT
    
    # Wait for all background processes
    wait
else
    echo -e "${RED}❌ Some dependencies are missing. Please run:${NC}"
    [ $BACKEND_OK -eq 0 ] && echo "  cd backend && npm install"
    [ $WEBSITE_OK -eq 0 ] && echo "  cd website && npm install"
    [ $MOBILE_OK -eq 0 ] && echo "  cd mobile-app && npm install"
    exit 1
fi
