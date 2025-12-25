# Name Override Scenarios (API JSONPath → relational table/column names)

This captures concrete patterns found in `packages/metaed-plugin-edfi-api-schema` where **API JSON naming** (as expressed in
`jsonSchemaForInsert`/`allJsonPathsMapping`) does **not** map 1:1 onto the **relational table/column names** produced by the
current `FlatteningMetadata` pipeline.

Some of these patterns likely require `resourceSchema.relational.nameOverrides`; others look fully derivable by stable
conventions, or are already captured by `documentPathsMapping.referenceJsonPaths` (reference identity alignment).

Key implementation points in the plugin:
- API naming rules: `packages/metaed-plugin-edfi-api-schema/src/enhancer/ApiPropertyMappingEnhancer.ts`
- Collision-driven API naming differences: `packages/metaed-plugin-edfi-api-schema/src/enhancer/SubclassPropertyNamingCollisionEnhancer.ts`
- Role name + `shortenTo` rules: `packages/metaed-plugin-edfi-api-schema/src/Utility.ts` (`adjustedFullPropertyName`, `canonicalRoleNamePrefix`)
- Reference identity field naming + `referenceJsonPaths`: `packages/metaed-plugin-edfi-api-schema/src/enhancer/JsonElementNamingHelper.ts`,
  `packages/metaed-plugin-edfi-api-schema/src/enhancer/DocumentPathsMappingEnhancer.ts`
- Relational table/column naming: `packages/metaed-plugin-edfi-api-schema/src/enhancer/flattening/FlatteningTableMetadataEnhancer.ts`

---

## Table Naming

### 1) ODS/API collection-name shortening (parent prefix removal)

**What happens**
- The API shortens some collection (and common) property names by removing a prefix that matches the *parent entity* name,
  or an overlapping suffix/prefix word boundary.
- This is implemented in `parentPrefixRemovalConvention()` in `ApiPropertyMappingEnhancer.ts`.

**Why it causes a mismatch**
- The **JSON array name** can be a short/generic plural (e.g., `identificationCodes`, `periods`, `categories`), while the
  **relational child table name** still needs the longer, type-specific naming context. (Column prefixing is covered in
  scenario 4.)

**Examples**

1) “IdentificationCodes” loses the `Assessment` prefix in JSON
```text
Resource: Assessment
JSONPath: $.identificationCodes[*]
Table:    AssessmentAssessmentIdentificationCode
```
Source: `packages/metaed-plugin-edfi-api-schema/test/enhancer/flattening/FlatteningMetadataComprehensive.test.ts`
(the `AssessmentIdentificationCode` test block).

2) “Periods” loses the `AssessmentAdministration` prefix in JSON
```text
Resource: AssessmentAdministration
JSONPath: $.periods[*]
Table:    AssessmentAdministrationAssessmentAdministrationPeriod
```
Source: `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
(`assessmentAdministrations` endpoint).

3) “Categories” loses the `EducationOrganization` prefix in JSON (for most EdOrg subtypes)
```text
Resource: LocalEducationAgency
JSONPath: $.categories[*]
Table:    LocalEducationAgencyEducationOrganizationCategory
```
Source: `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
(many endpoints, e.g. `localEducationAgencies`).

---

### 2) Subclass/superclass naming collisions disable shortening (decollisioned names)

**What happens**
- Some properties normally get shortened (see #1), but if that shortening would collide with another property on a
  subclass, the API uses a “decollisioned” name (i.e., preserves the longer prefix).
- Collision detection: `SubclassPropertyNamingCollisionEnhancer.ts`
- Name selection at runtime: `topLevelApiNameOnEntity()` in `Utility.ts` chooses between `topLevelName` and
  `decollisionedTopLevelName`.

**Why it causes a mismatch**
- The same conceptual property can surface under different JSON names depending on subclass context, which means any
  naive “always shorten” or “always preserve” inference will be wrong for some resources.

**Example**
School has both:
- `$.schoolCategories[*]` (school-specific categories)
- `$.educationOrganizationCategories[*]` (inherited EdOrg categories, *cannot* shorten to `$.categories[*]` on School)

Evidence (tables/paths):
```text
Resource: School
JSONPath: $.educationOrganizationCategories[*]  → Table: SchoolEducationOrganizationCategory
JSONPath: $.schoolCategories[*]                 → Table: SchoolSchoolCategory
```
Source: `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
(`schools` endpoint).

---

## Reference FK Column Naming

### 3) Reference role prefixes vs JSON reference names (camelCase vs underscore + repeated tokens)

**What happens**
- JSON reference properties are named like `<adjustedFullPropertyName>Reference` (camelCase in JSON).
- Flattening FK columns are named using **underscore-separated role prefixes** + referenced `metaEdName` + `_Id`
  (see `buildReferenceColumn()` in `FlatteningTableMetadataEnhancer.ts`).

**Why it causes a mismatch**
- Even when the JSON reference property does not “repeat” a role prefix (because it collapses redundancy), the FK column
  naming can still carry both the role prefix and the referenced entity name as separate underscore tokens.

**Examples**

1) Role name is a prefix of the referenced entity name (collapsed in JSON, repeated in FK column)
```text
Resource: ChartOfAccount
JSON property: balanceSheetDimensionReference
Column:        BalanceSheet_BalanceSheetDimension_Id
```
Sources:
- API naming rule prevents repetition: `packages/metaed-plugin-edfi-api-schema/test/enhancer/ApiPropertyMappingEnhancer.test.ts`
  (“role name as prefix … BalanceSheetDimension”)
- Actual schema artifact includes `balanceSheetDimensionReference`:
  `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated.json`
- Flattening report shows the FK column:
  `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`

2) Role name equals the referenced entity name (duplicated token in FK column)
```text
Resource: StaffProgramAssociation
JSON property: programReference
Column:        Program_Program_Id
```
Sources:
- `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated.json`
  (`staffProgramAssociations` schema; `$.programReference...` in `documentPathsMapping.Program.referenceJsonPaths`)
- `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
  (`staffProgramAssociations` endpoint)

3) `shortenTo` changes the role-prefix token used by the FK column
```text
Resource: StudentCompetencyObjective
JSON property: objectiveCompetencyObjectiveReference
Column:        Objective_CompetencyObjective_Id
```
Sources:
- JSON schema: `packages/metaed-plugin-edfi-api-schema/test/enhancer/JsonSchemaForInsertEnhancer.test.ts`
  (“referencing another using a shortenTo directive”)
- Flattening metadata: `packages/metaed-plugin-edfi-api-schema/test/enhancer/flattening/FlatteningMetadataComprehensive.test.ts`
  (same scenario)

---

## Scalar/Wrapper Naming

### 4) Role-prefixed scalar columns inside collection/common tables

**What happens**
- Scalar columns use `prefixedName(sourceProperty.metaEdName, modifier)` where the modifier’s `parentPrefixes` are derived
  from `canonicalRoleNamePrefix()` across the property chain (see `collectScalarPrefixes()` in
  `FlatteningTableMetadataEnhancer.ts`).

**Why it causes a mismatch**
- This is a **column naming** concern (distinct from scenario 1’s **table naming**): the JSON property name can be generic
  (e.g., `maxNumericRating`), but the relational column name may be role-prefixed to preserve context or avoid collisions.

**Examples**

1) “Alternative…” prefix appears in columns but not in JSON scalar property names
```text
Resource: CourseTranscript
JSONPath: $.alternativeCourseIdentificationCodes[*].identificationCode
Column:   AlternativeIdentificationCode
```
Source: `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
(`courseTranscripts` endpoint; see also `AlternativeAssigningOrganizationIdentificationCode`, etc.).

2) Role prefix added to scalar columns inside a child table
```text
Resource: ProgramEvaluationElement
JSONPath: $.programEvaluationLevels[*].maxNumericRating
Column:   ElementMaxNumericRating
```
Source: `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
(`programEvaluationElements` endpoint).

---

### 5) Deterministic-but-not-literal naming differences (usually rules, not overrides)

These are still “mismatches” when comparing JSON names to relational names, but they look fully deterministic and may not
need `nameOverrides` if the relational mapper bakes in the same conventions.

**What happens**
- Descriptor properties map to `...DescriptorId` columns.
- `SchoolYearTypeReference.schoolYear` (and similar wrappers) flatten to a single `...SchoolYear` scalar.

**Why it causes a mismatch**
- JSON uses a `...Descriptor` scalar (URI), but relational uses a descriptor FK id.
- JSON uses a wrapper object for school year, while relational uses a plain scalar column.

**Examples**

1) Descriptor references
```text
JSONPath: $.schoolTypeDescriptor
Column:   SchoolTypeDescriptorId
```
Example from `schools` endpoint in
`packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`.

2) SchoolYearEnumeration wrapper object
```text
JSONPath: $.schoolYearTypeReference.schoolYear
Column:   SchoolYear
```
Example from `calendars` endpoint in
`packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`.
(When used inside reference objects, the same wrapper flattening shows up as prefixed reference fields; see scenario 6.)

---

## Reference Identity Fields (`referenceJsonPaths`)

### 6) `referenceJsonPaths` leaf differs from referenced `identityJsonPath` leaf

`DocumentPaths.referenceJsonPaths` pairs a referenced resource’s `identityJsonPath` with the referring document’s
`referenceJsonPath` for the *same* identity element. In most cases the **leaf property name matches**, but there are
notable exceptions where the **leaf is renamed** in the reference object to carry additional context.

This is primarily handled by `documentPathsMapping.referenceJsonPaths` (not `relational.nameOverrides`), but it is one of
the key “naming mismatch” areas that shows up when mapping JSON references to relational FKs.

This is driven by the reference identity “flattening” prefix behavior in:
`packages/metaed-plugin-edfi-api-schema/src/enhancer/JsonElementNamingHelper.ts` (`parentPropertyModifier()`), which
prefixes identity element names using the next-to-last property in the identity chain (honoring `shortenTo`).

**How this shows up relationally**
- Each reference object in JSON ultimately resolves to a single `bigint` FK column on the referring table (see scenario 3).
- `referenceJsonPaths` are the path-level “glue” used to match reference-object scalar values to the referenced resource’s
  identity elements, which sometimes requires extra joins when an identity element is nested under another reference.

#### Underlying scenarios

1) **Identity includes a nested reference (multi-hop identity resolution + prefixed reference fields)**
- The referenced identity has a path like `$.gradingPeriodReference.schoolYear` (identity element lives under a
  reference), but the referring document flattens it into a single prefixed field like `gradingPeriodSchoolYear`.
- In the DB, that identity element is not a scalar on the referenced table; it is reached via one (or more) FK columns.
  This is why a single reference field can map to columns on a *different* table than the referenced table’s root.

Example: ReportCard → Grade (and Grade → GradingPeriod)
```text
Referring document field:
  $.grades[*].gradeReference.gradingPeriodSchoolYear
Maps to referenced identity path:
  $.gradingPeriodReference.schoolYear

FK column stored on the referring table:
  ReportCardGrade.Grade_Id

Referenced identity storage spans multiple tables:
  Grade.GradingPeriod_GradingPeriod_Id   (FK to GradingPeriod)
  GradingPeriod.SchoolYear               (scalar)
```
Sources:
- `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
  (`reportCards`, `grades`, `gradingPeriods` endpoints)

2) **SchoolYearEnumeration wrapper flattening + role prefixing**
- The referenced identity uses a wrapper path like `$.graduationSchoolYearTypeReference.schoolYear`, but the reference
  object flattens and prefixes to a single field like `graduationSchoolYear`.
- Relationally this often becomes a single scalar column with the role prefix (no wrapper) (see scenario 5’s wrapper example).

Example: StudentSchoolAssociation → GraduationPlan
```text
Referring document field:
  $.graduationPlanReference.graduationSchoolYear
Maps to referenced identity path:
  $.graduationSchoolYearTypeReference.schoolYear

FK column stored on the referring table:
  StudentSchoolAssociation.GraduationPlan_Id

Referenced identity storage includes:
  GraduationPlan.GraduationSchoolYear
```
Sources:
- `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated-flattening-report.txt`
  (`studentSchoolAssociations`, `graduationPlans` endpoints)
