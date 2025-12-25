# Relational Review Findings

## High Severity
- `rootTableNameOverride` is never computed or serialized, so resources whose physical root table name differs from `resourceName` (extensions, suffix cases) will never emit the required override. `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational/RelationalMetadataAssemblerEnhancer.ts:33`, `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational/RelationalNameOverrideBuilderEnhancer.ts:29`
- Descriptor naming is not normalized between JSON and relational plans. JSON base names include the `Descriptor` suffix (`jsonScalarBaseNameFor`), while relational base names come from `property.metaEdName` and may omit the suffix. This will produce overrides for every descriptor and defeats the “limited overrides” goal. `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational/RelationalJsonPathNamingPlanEnhancer.ts:56`, `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational/RelationalPhysicalNamingPlanEnhancer.ts:54`

## Medium Severity
- School year enumeration base names are hard-coded to `SchoolYear` on the JSON side, but relational names still include role-prefixes via `collectScalarPrefixes`, which will generate overrides for all role-prefixed school year cases (the design calls these deterministic and avoidable). `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational/RelationalJsonPathNamingPlanEnhancer.ts:62`, `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational/RelationalPhysicalNamingPlanEnhancer.ts:54`

## Questions / Assumptions
- Do MetaEd descriptor properties ever include the `Descriptor` suffix in `metaEdName`? If they don’t (typical), we should normalize JSON base names (or filter descriptor paths during override building) to avoid emitting overrides for all descriptor fields.
- For school year enumeration references, should the JSON base name include role prefixes (e.g., `GraduationSchoolYear`) to avoid overrides, or should those paths be excluded as deterministic? I assumed the latter based on the design doc.
