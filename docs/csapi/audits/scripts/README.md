<!--
@license BSD-3-Clause
Copyright (c) 2024 OS4CSAPI contributors
-->

# CSAPI Audit Scripts

This directory contains automation scripts for auditing the OGC API Connected Systems implementation.

## Scripts

### `csapi_quick_audit.sh`

A quick audit script that provides a summary of CSAPI files and status.

**Usage:**

```bash
./csapi_quick_audit.sh
```

**Output:**

- File counts by category
- Code quality metrics (TODOs, skipped tests)
- Integration status

**Duration:** ~1 second

### `security_scan.sh`

Comprehensive security scanner that detects sensitive information in fixtures and documentation.

**Usage:**

```bash
./security_scan.sh
```

**Checks for:**

- API keys, tokens, and credentials
- Email addresses (except example.com)
- IP addresses
- Production/staging URLs
- Database connection strings
- SSH/private keys
- Authentication headers

**Exit Codes:**

- `0` - No sensitive data found (PASS)
- `1` - Sensitive data detected (FAIL)
- `2` - Script error

**Duration:** ~5 seconds

**Output:** Colorized report with findings categorized as critical or acceptable.

### Future Scripts

Additional audit scripts can be added here to automate:

- Test coverage reports
- Formatting and linting checks
- Conformance test execution
- Changelog generation
- PR preparation checks

## Running the Scripts

1. Make scripts executable (if not already):

   ```bash
   chmod +x *.sh
   ```

2. Run from repository root:

   ```bash
   # Quick audit
   ./docs/csapi/audits/scripts/csapi_quick_audit.sh

   # Security scan
   ./docs/csapi/audits/scripts/security_scan.sh
   ```

3. Security scan can also be run in CI:
   ```bash
   # Exit code 0 = pass, 1 = fail
   ./docs/csapi/audits/scripts/security_scan.sh || exit 1
   ```

## Integration with CI/CD

These scripts can be integrated into CI/CD pipelines to:

- Automatically audit changes on PRs
- Track metrics over time
- Enforce quality gates before merging

## Contributing

When adding new audit scripts:

1. Follow the naming convention: `csapi_*_audit.sh`
2. Include usage instructions in comments
3. Update this README with the new script
4. Make scripts fail fast with `set -e`
5. Provide meaningful output and status codes
