#!/bin/bash

# One-Click Accounting Test Script
# This script helps test the system components

echo "🧪 One-Click Accounting System Test"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
APPS_SCRIPT_URL=""  # Add your deployed Apps Script URL here
TEST_EXPENSE_DATA='{"amount": 12.50, "description": "Test Coffee Purchase", "location": "Test Location", "payment_method": "Credit Card"}'

echo -e "${BLUE}Step 1: Checking project structure...${NC}"

# Check if required directories exist
directories=("apps-script" "shortcuts" "config" "docs")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "✅ $dir directory exists"
    else
        echo -e "❌ $dir directory missing"
    fi
done

echo ""
echo -e "${BLUE}Step 2: Checking required files...${NC}"

# Check if required files exist
files=(
    "apps-script/Code.gs"
    "apps-script/appsscript.json"
    "shortcuts/OneClickAccounting.json"
    "shortcuts/SETUP_GUIDE.md"
    "config/config.template.json"
    "config/.env.template"
    "docs/SETUP_GUIDE.md"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file exists"
    else
        echo -e "❌ $file missing"
    fi
done

echo ""
echo -e "${BLUE}Step 3: Testing Apps Script endpoint (if URL provided)...${NC}"

if [ -z "$APPS_SCRIPT_URL" ]; then
    echo -e "${YELLOW}⚠️  Apps Script URL not provided. Add it to the APPS_SCRIPT_URL variable to test.${NC}"
    echo -e "   Example: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
else
    echo "Testing POST request to Apps Script..."
    
    # Test POST request
    RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$TEST_EXPENSE_DATA" \
        "$APPS_SCRIPT_URL")
    
    if echo "$RESPONSE" | grep -q "success.*true"; then
        echo -e "✅ Apps Script endpoint working correctly"
        echo -e "   Response: $RESPONSE"
    else
        echo -e "❌ Apps Script endpoint failed"
        echo -e "   Response: $RESPONSE"
    fi
fi

echo ""
echo -e "${BLUE}Step 4: Validating configuration templates...${NC}"

# Check JSON syntax in config files
if [ -f "config/config.template.json" ]; then
    if python3 -m json.tool config/config.template.json > /dev/null 2>&1; then
        echo -e "✅ config.template.json is valid JSON"
    else
        echo -e "❌ config.template.json has invalid JSON syntax"
    fi
fi

if [ -f "shortcuts/OneClickAccounting.json" ]; then
    if python3 -m json.tool shortcuts/OneClickAccounting.json > /dev/null 2>&1; then
        echo -e "✅ OneClickAccounting.json is valid JSON"
    else
        echo -e "❌ OneClickAccounting.json has invalid JSON syntax"
    fi
fi

echo ""
echo -e "${BLUE}Step 5: Checking documentation completeness...${NC}"

# Check if key documentation sections exist
if grep -q "Setup Guide" docs/SETUP_GUIDE.md; then
    echo -e "✅ Setup guide contains setup instructions"
else
    echo -e "❌ Setup guide missing setup instructions"
fi

if grep -q "iPhone Shortcuts" shortcuts/SETUP_GUIDE.md; then
    echo -e "✅ Shortcuts setup guide exists"
else
    echo -e "❌ Shortcuts setup guide incomplete"
fi

echo ""
echo -e "${GREEN}🎉 Test Summary${NC}"
echo "=================="

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. 📝 Fill in your actual API keys in the config files"
echo "2. 🚀 Deploy the Apps Script and update APPS_SCRIPT_URL in this test script"
echo "3. 📱 Set up the iPhone shortcut following shortcuts/SETUP_GUIDE.md"
echo "4. 🧪 Run this test script again with your deployed URL"
echo "5. ✅ Test end-to-end by logging a real expense from your iPhone"

echo ""
echo -e "${BLUE}For detailed setup instructions, see:${NC}"
echo "📖 docs/SETUP_GUIDE.md"
echo ""

# Generate a simple test report
cat > test_report.txt << EOF
One-Click Accounting Test Report
Generated: $(date)

Project Structure: $([ -d "apps-script" ] && [ -d "shortcuts" ] && [ -d "config" ] && [ -d "docs" ] && echo "✅ Complete" || echo "❌ Incomplete")
Required Files: $(ls apps-script/Code.gs shortcuts/OneClickAccounting.json config/config.template.json docs/SETUP_GUIDE.md README.md > /dev/null 2>&1 && echo "✅ All Present" || echo "❌ Missing Files")
Apps Script Test: $([ -z "$APPS_SCRIPT_URL" ] && echo "⚠️  Not Tested (No URL)" || echo "🧪 Attempted")

Next: Deploy Apps Script, configure iPhone shortcut, test end-to-end
EOF

echo -e "${GREEN}📄 Test report saved to test_report.txt${NC}"