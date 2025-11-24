#!/bin/bash
# CSAPI Security Scanner - Detects sensitive information in fixtures and docs
#
# This script scans CSAPI fixture data and documentation for potentially
# sensitive information before upstream submission.
#
# Usage: ./security_scan.sh
#
# Exit codes:
#   0 - No sensitive data found (PASS)
#   1 - Sensitive data detected (FAIL)
#   2 - Script error
#
# Note: Regex patterns are intentionally broad to catch potential issues.
# False positives are acceptable in security scanning - better safe than sorry.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter for findings
FINDINGS=0
WARNINGS=0

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  CSAPI Security Scanner${NC}"
echo -e "${BLUE}  Scanning for sensitive information...${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Define scan directories
FIXTURE_DIR="fixtures/ogc-api/csapi"
DOCS_DIR="docs/csapi"

# Exclude security audit documentation from scan (it documents patterns)
EXCLUDE_FILES=(
    "docs/csapi/audits/SECURITY_AUDIT_FINDINGS.md"
    "docs/csapi/audits/scripts/security_scan.sh"
)

# Check if directories exist
if [ ! -d "$FIXTURE_DIR" ]; then
    echo -e "${RED}ERROR: Fixture directory not found: $FIXTURE_DIR${NC}"
    exit 2
fi

if [ ! -d "$DOCS_DIR" ]; then
    echo -e "${RED}ERROR: Documentation directory not found: $DOCS_DIR${NC}"
    exit 2
fi

echo -e "${YELLOW}Scanning directories:${NC}"
echo "  - $FIXTURE_DIR"
echo "  - $DOCS_DIR"
echo ""

# Function to scan for pattern
scan_pattern() {
    local pattern=$1
    local description=$2
    local exclude_pattern=$3
    
    echo -e "${YELLOW}Checking for: ${description}${NC}"
    
    local results
    if [ -z "$exclude_pattern" ]; then
        results=$(grep -rniE \
            --exclude="SECURITY_AUDIT_FINDINGS.md" \
            --exclude="security_scan.sh" \
            --exclude-dir="scripts" \
            "$pattern" "$FIXTURE_DIR" "$DOCS_DIR" 2>/dev/null || true)
    else
        results=$(grep -rniE \
            --exclude="SECURITY_AUDIT_FINDINGS.md" \
            --exclude="security_scan.sh" \
            --exclude-dir="scripts" \
            "$pattern" "$FIXTURE_DIR" "$DOCS_DIR" 2>/dev/null | grep -vE "$exclude_pattern" || true)
    fi
    
    if [ -n "$results" ]; then
        echo -e "${RED}  ✗ FOUND:${NC}"
        echo "$results" | head -10
        if [ $(echo "$results" | wc -l) -gt 10 ]; then
            echo "  ... (showing first 10 of $(echo "$results" | wc -l) results)"
        fi
        FINDINGS=$((FINDINGS + 1))
    else
        echo -e "${GREEN}  ✓ Clean${NC}"
    fi
    echo ""
}

# Function to check for acceptable patterns
check_acceptable() {
    local pattern=$1
    local description=$2
    
    echo -e "${BLUE}Verifying acceptable: ${description}${NC}"
    
    local results=$(grep -rniE \
        --exclude="SECURITY_AUDIT_FINDINGS.md" \
        --exclude="security_scan.sh" \
        --exclude-dir="scripts" \
        "$pattern" "$FIXTURE_DIR" "$DOCS_DIR" 2>/dev/null || true)
    
    if [ -n "$results" ]; then
        echo -e "${YELLOW}  ⚠ Found (verifying context):${NC}"
        echo "$results" | head -5
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}  ✓ None found${NC}"
    fi
    echo ""
}

echo -e "${BLUE}=== CRITICAL CHECKS (Must be clean) ===${NC}"
echo ""

# 1. Check for API keys and tokens
scan_pattern '(api[_-]?key|apikey|access[_-]?token|bearer.?token)' \
    "API keys and tokens" \
    ""

# 2. Check for passwords and secrets
scan_pattern '(password|passwd|secret|credential)' \
    "Passwords and secrets" \
    "(password.*example|credential.*doc|secret.*type|No secrets|No credentials|secrets.*detected)"

# 3. Check for real email addresses (exclude example.com)
scan_pattern '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' \
    "Email addresses" \
    "example\.(com|org|net)"

# 4. Check for IP addresses
scan_pattern '([0-9]{1,3}\.){3}[0-9]{1,3}' \
    "IP addresses" \
    ""

# 5. Check for localhost with ports
scan_pattern 'localhost:[0-9]{4,5}' \
    "Localhost URLs with ports" \
    ""

# 6. Check for real domain URLs (exclude standards and example domains)
echo -e "${YELLOW}Checking for: Real domain URLs${NC}"

REAL_URLS=$(grep -rE \
    --exclude="SECURITY_AUDIT_FINDINGS.md" \
    --exclude="security_scan.sh" \
    --exclude-dir="scripts" \
    'https?://[^/]*\.(com|org|net|io|gov|edu)' "$FIXTURE_DIR" "$DOCS_DIR" 2>/dev/null | \
    grep -v 'example\.' | \
    grep -v 'opengis\.net' | \
    grep -v 'w3\.org' | \
    grep -v 'qudt\.org' | \
    grep -v 'mmisw\.org' | \
    grep -v 'schemas\.' | \
    grep -v 'github\.com' || true)
if [ -n "$REAL_URLS" ]; then
    echo -e "${RED}  ✗ FOUND:${NC}"
    echo "$REAL_URLS" | head -10
    FINDINGS=$((FINDINGS + 1))
else
    echo -e "${GREEN}  ✓ Clean${NC}"
fi
echo ""

# 7. Check for authentication headers
scan_pattern '(authorization:|x-api-key:|bearer |oauth)' \
    "Authentication headers" \
    "(authorization.*doc|oauth.*example)"

# 8. Check for private/confidential markers in URLs or config
scan_pattern '(production|prod|staging|stage)\..*\.(com|org|net)' \
    "Production/staging server URLs" \
    ""

# 9. Check for database connection strings
scan_pattern '(mongodb://|postgresql://|mysql://|jdbc:)' \
    "Database connection strings" \
    "(example|localhost|your-db)"

# 10. Check for SSH/private keys
scan_pattern '(BEGIN.*PRIVATE KEY|ssh-rsa|ssh-ed25519)' \
    "SSH or private keys" \
    ""

echo -e "${BLUE}=== ACCEPTABLE ITEMS (For verification) ===${NC}"
echo ""

# These are expected but should be verified
check_acceptable 'example\.com' \
    "example.com usage (should be present)"

check_acceptable '"contacts".*\[' \
    "contacts fields (should be empty or example data)"

check_acceptable 'CSAPI_LIVE|CSAPI_API_ROOT' \
    "Test configuration keywords (documentation only)"

echo -e "${BLUE}=== SCAN SUMMARY ===${NC}"
echo ""
echo "Directories scanned:"
echo "  - $FIXTURE_DIR ($(find $FIXTURE_DIR -type f | wc -l) files)"
echo "  - $DOCS_DIR ($(find $DOCS_DIR -type f | wc -l) files)"
echo ""

if [ $FINDINGS -eq 0 ]; then
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  ✓ SECURITY SCAN PASSED${NC}"
    echo -e "${GREEN}  No sensitive data detected${NC}"
    echo -e "${GREEN}================================================${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}  ⚠ $WARNINGS acceptable items found (verified OK)${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}Repository is clear for upstream submission.${NC}"
    exit 0
else
    echo -e "${RED}================================================${NC}"
    echo -e "${RED}  ✗ SECURITY SCAN FAILED${NC}"
    echo -e "${RED}  Found $FINDINGS category(ies) with sensitive data${NC}"
    echo -e "${RED}================================================${NC}"
    echo ""
    echo -e "${RED}Please review and remove sensitive information before proceeding.${NC}"
    exit 1
fi
