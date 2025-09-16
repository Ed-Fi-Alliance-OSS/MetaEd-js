# Plan Level 0: Migrate Hardcoded Diminishers to Configuration-Based Enhancers

## Migration Plan: Hardcoded Diminishers to Configuration-Based Enhancers

This plan implements the migration from 4 hardcoded diminishers to 2 configuration-based enhancers following the proposal in edfi-api-schema-security-config-option1.md.

### Phase 1: Setup Configuration Infrastructure

1. **Update plugin initialization** (packages/metaed-plugin-edfi-api-schema/src/index.ts):
   - Import Joi for validation schemas
   - Create configuration schema maps for both rule types
   - Register schemas in the initialize() function

2. **Create configuration file** (edfiApiSchema.config.json):
   - Define all existing security rules in configuration format
   - Include version constraints and mode settings
   - Place in packages/metaed-plugin-edfi-api-schema/test/integration directory

3. **Create EducationOrganizationSecurityEnhancer.ts**:
   - Handle direct property mappings (DisciplineAction, StudentAssessment, OrganizationDepartment)
   - Read configuration from entity.config?.edfiApiSchema
   - Support append/replace modes
   - Process version constraints
   - Look up specified properties and add to educationOrganizationSecurableElements

4. **Create test for EducationOrganizationSecurityEnhancer**:
   - Test scenarios MUST mirror those in the diminisher tests!
   - Test DisciplineAction configuration injection and processing
   - Test StudentAssessment configuration injection and processing
   - Test OrganizationDepartment with replace mode
   - Test version constraint validation
   - Test error cases (missing properties, invalid configuration)

### Implementation Details

**Key Testing Pattern Changes:**
- Tests will inject configuration directly into entity.config.edfiApiSchema before running enhancers
- This simulates the configuration system's annotation phase
- Example injection for tests:
```typescript
entity.config = {
  edfiApiSchema: {
    versionRange: ">=4.0.0-a",
    securableElements: [{
      propertyPath: "ResponsibilitySchool",
      requiredIdentityProperty: "SchoolId",
      description: "Test configuration"
    }]
  }
};
```

**Configuration Schema Registration:**
```typescript
configurationSchemas.set('educationOrganizationSecurableElements', Joi.object().keys({
  versionRange: Joi.string(),
  mode: Joi.string().valid('append', 'replace').default('append'),
  securableElements: Joi.array().items(
    Joi.object().keys({
      propertyPath: Joi.string().required(),
      requiredIdentityProperty: Joi.string().required(),
      description: Joi.string()
    })
  ).min(1).required()
}));
```