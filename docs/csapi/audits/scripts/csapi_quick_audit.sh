#!/bin/bash
# CSAPI Quick Audit Script
# Performs a quick audit of CSAPI deliverables
# Usage: ./csapi_quick_audit.sh

echo "=== CSAPI Quick Audit ==="
echo ""

# Count files
TOTAL_CSAPI=$(git ls-files | grep -i csapi | wc -l)
CLIENT_CODE=$(git ls-files | grep "^src/ogc-api/csapi/" | grep "\.ts$" | grep -v "spec\.ts" | grep -v "__tests__" | wc -l)
TEST_FILES=$(git ls-files | grep "^src/ogc-api/csapi/__tests__/.*\.spec\.ts$" | wc -l)
FIXTURE_FILES=$(git ls-files | grep "^fixtures/ogc-api/csapi/" | wc -l)
DOC_FILES=$(git ls-files | grep "^docs/csapi/" | wc -l)

echo "File Counts:"
echo "  Total CSAPI Files: $TOTAL_CSAPI"
echo "  Client Code: $CLIENT_CODE"
echo "  Tests: $TEST_FILES"
echo "  Fixtures: $FIXTURE_FILES"
echo "  Documentation: $DOC_FILES"
echo ""

# Check TODOs
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ogc-api/csapi/ --include="*.ts" 2>/dev/null | wc -l || echo "0")
echo "Code Quality:"
echo "  TODO/FIXME comments: $TODO_COUNT"

# Check skipped tests
SKIPPED_COUNT=$(grep -r "it.skip\|describe.skip\|xit\|xdescribe" src/ogc-api/csapi/__tests__/ --include="*.spec.ts" 2>/dev/null | wc -l || echo "0")
echo "  Skipped tests: $SKIPPED_COUNT"
echo ""

# Check integration
CSAPI_IN_INDEX=$(grep -i "csapi" src/index.ts 2>/dev/null | wc -l || echo "0")
echo "Integration:"
if [ "$CSAPI_IN_INDEX" -gt 0 ]; then
  echo "  ✅ Exported from main index"
else
  echo "  ⚠️ NOT exported from main index"
fi

ENDPOINT_INT=$(grep -i "hasConnectedSystemsApi" src/ogc-api/endpoint.ts 2>/dev/null | wc -l || echo "0")
if [ "$ENDPOINT_INT" -gt 0 ]; then
  echo "  ✅ Integrated with OgcApiEndpoint"
else
  echo "  ⚠️ Not integrated with OgcApiEndpoint"
fi
echo ""

echo "=== Audit Complete ==="
