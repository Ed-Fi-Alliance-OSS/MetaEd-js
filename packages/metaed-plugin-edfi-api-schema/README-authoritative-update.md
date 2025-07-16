# Authoritative File Update Automation

This package includes a TypeScript script and npm scripts to automate the workflow of updating authoritative JSON files with newly generated content.

## Overview

The AuthoritativeCompare tests generate API schema JSON files and compare them to "authoritative" reference files. When you make changes to the MetaEd system, these tests typically fail because the generated content differs from the authoritative files. This automation script copies the generated JSON content to the authoritative files.

## Usage

### NPM Scripts (Recommended)

```bash
npm run update-authoritative
```

This command will automatically copy all generated files to their authoritative counterparts.

### Direct Script Usage

You can also run the script directly for more options:

```bash
# Copy generated files to authoritative files
npx ts-node test/integration/update-authoritative-files.ts

# Preview what would be done without making changes
npx ts-node test/integration/update-authoritative-files.ts --dry-run

# Show help
npx ts-node test/integration/update-authoritative-files.ts --help
```

### NPM Script Options

```bash
# Copy files
npm run update-authoritative

# Preview changes without modifying files
npm run update-authoritative:dry-run
```

## What Gets Updated

The script automatically handles all the file mappings across the three test scenarios:

### v7.1 (Data Standard 5.0)
- `ds-5.0-api-schema-generated.json` → `ds-5.0-api-schema-authoritative.json`

### v7.2 (Data Standard 5.1 + TPDM 1.1) 
- `ds-5.1-api-schema-generated.json` → `ds-5.1-api-schema-authoritative.json`
- `tpdm-api-schema-generated.json` → `tpdm-api-schema-authoritative.json`

### v7.3 (Data Standard 5.2 + TPDM 1.1)
- `ds-5.2-api-schema-generated.json` → `ds-5.2-api-schema-authoritative.json`
- `homograph-api-schema-generated.json` → `homograph-api-schema-authoritative.json`
- `sample-api-schema-generated.json` → `sample-api-schema-authoritative.json`
- `tpdm-api-schema-generated.json` → `tpdm-api-schema-authoritative.json`

## Workflow

1. **Make changes** to the MetaEd system
2. **Run the update script**:
   ```bash
   npm run update-authoritative
   ```
3. **Verify tests now pass**:
   ```bash
   npx jest --testPathPattern="ApiSchemaAuthoritativeCompare"
   ```

## Expected Behavior

- **Test failures are expected** during the first run when files differ
- The script will **continue running** even if tests fail (this is intentional)
- You'll see colored output with progress information:
  ```
  Step 1: Running AuthoritativeCompare tests...
  Running test: Data Standard 5.0 for ODS/API 7.1
  ⚠ Test may have failed, but continuing to copy generated files...
  
  Step 2: Copying generated files to authoritative files...
  Updating authoritative files for: Data Standard 5.0 for ODS/API 7.1
    ✓ Copied: ds-5.0-api-schema-generated.json → ds-5.0-api-schema-authoritative.json
  ...
  ```

## Dry Run Mode

Before making actual changes, you can preview what the script would do:

```bash
npm run update-authoritative:dry-run
```

This will show you exactly which files would be copied without actually modifying anything.

## Troubleshooting

**"No generated files found"**: This means the tests didn't run successfully or didn't generate output files. Check that:
- You're running from the correct package directory
- The test dependencies are installed (`npm install`)
- There are no TypeScript compilation errors

**Permission errors**: Ensure you have write permissions to the `test/integration/artifact/` directories.

**Tests still failing after update**: Run the tests again to verify they pass:
```bash
cd ../.. && npx jest --testPathPattern="packages/metaed-plugin-edfi-api-schema/test/integration/ApiSchemaAuthoritativeCompare"
```
