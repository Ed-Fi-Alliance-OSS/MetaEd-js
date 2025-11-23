# GitHub Copilot Guidelines for MetaEd-js

This document provides instructions for GitHub Copilot working on the MetaEd-js codebase. Follow these guidelines to ensure code quality, consistency, and proper testing protocols.

## AGENTS.md

First, read the AGENTS.md file. All agents must follow these instructions.

## Testing Requirements

### Linting and Type Checking

- **REQUIRED**: Execute `npm run build` before submitting any changes and correct any build errors
- **REQUIRED**: Execute `npm run test:lint` before submitting any changes
- **REQUIRED**: Correct any and all linting errors that are reported
- The lint command includes both TypeScript type checking and ESLint validation
- Do not suppress linting errors unless absolutely necessary and properly documented

### Unit Testing

- **REQUIRED**: Execute `test:unit:non-database` to run the test suite
- Ensure all unit tests pass before submitting changes
- The unit test command automatically excludes database tests

## Critical Restrictions

### Approval Tests

- **NEVER** make changes to approval tests or snapshot tests
- Approval tests use `toMatchSnapshot()` and are found throughout the codebase
- These tests capture expected output and should only be updated by human developers when intentional changes are made

### Database Tests

- **NEVER** run database tests directly
- **NEVER** execute the following commands:
  - `npm run test`
  - `npm run test:unit`
  - `npm run test:unit:db:postgresql`
  - `npm run test:unit:db:sqlserver`
  - Any database setup or initialization scripts
- Database tests require specific infrastructure setup and should only be run in appropriate environments
- The standard `npm run test:unit` command is safe as it runs non-database tests and SQL Server tests in a controlled manner

## Summary Checklist

Before submitting any changes, ensure you have:

- [ ] Read and followed [`CodingStyle.md`](../docs/CodingStyle.md) guidelines
- [ ] Verified `.editorconfig` settings are respected
- [ ] Run `npm run test:lint` and fixed all reported issues
- [ ] Run `npm run test:unit` and confirmed all tests pass
- [ ] Made no changes to approval/snapshot tests
- [ ] Avoided running database tests directly

Following these guidelines will help maintain code quality and prevent disruption to the development workflow.
