## Flattening Enhancer Execution Plan

### Current Focus
- Finish the remaining flattening enhancers so relational metadata aligns with the architecture design and passes integration tests.
- Drive all behaviour from existing ApiSchema data (`collectedApiProperties`, `documentPathsMapping`, identity metadata) rather than string heuristics.
- Keep enhancers small and composable so each concern remains unit-testable.

### Completed Foundations
- Branded helper modules (`TableBuilder`, `ColumnFactory`, `ReferenceMapper`, `SqlTypeDeriver`) provide immutable builders and branded strings.
- `FlatteningMetadataInitializerEnhancer` seeds root tables using helper utilities and handles extension/subclass flags.
- `FlatteningTableStructureEnhancer` builds child-table hierarchies by walking `collectedApiProperties`, including extension entities, with a depth guard.
- Unit tests cover the helper layer and the table-structure enhancer; snapshots document expected tree layouts.

### Remaining Enhancer Work
- `FlatteningColumnBuilderEnhancer`: regenerate identity/scalar columns using helpers, ensure parent-reference columns land once per child table, and add unit tests.
- `FlatteningReferenceEnhancer`: use `documentPathsMapping` to emit FK columns, support descriptor references, and emit polymorphic metadata without duplicating scalar logic. Add exhaustive tests.
- `FlatteningTypeDecoratorEnhancer`: rely on ApiSchema signals (boolean/date/decimal metadata, JSON schema) for `columnType`, `maxLength`, `precision`, `scale`. Remove the legacy name-based fallbacks and add unit tests.
- `AbstractResourceFlatteningEnhancer` (new): maintain `AbstractResourceFlatteningMetadata`, mark subclass tables with `discriminatorValue`, and tag columns that carry superclass identities. Cover with unit tests.
- `PolymorphicReferenceEnhancer` follow-up: validate discriminator columns and `isSuperclassIdentity` flags added by earlier stages.

### Integration Gaps to Close
- Association references currently lack identity ApiSchema data when building JSON path mappings. Resolve this before re-running the integration suite.
- Superclass identity markers are not yet emitted, and SQL typing still defaults to strings for some primitives. Address within the remaining enhancers.
- Extension entities need their flattening metadata populated once collections are parsed from the extension's base entity.
- Update integration fixtures and expectations once the above enhancers are complete; rerun `FlatteningMetadataIntegration.test.ts` until green.

### Next Steps
1. Refactor `FlatteningColumnBuilderEnhancer` using the helper factories; add unit tests.
2. Implement `FlatteningReferenceEnhancer` against `documentPathsMapping` and extend tests to cover descriptor/polymorphic cases.
3. Enhance `FlatteningTypeDecoratorEnhancer` to consume ApiSchema numeric/date metadata and JSON schema lengths; add tests.
4. Introduce `AbstractResourceFlatteningEnhancer` and align `PolymorphicReferenceEnhancer` with the new metadata.
5. Update `EnhancerList` ordering once new enhancers are ready.
6. Re-run unit and integration suites, investigate remaining failures, and iterate until passing.

### Testing Strategy
- Unit: each enhancer plus helper modules via `MetaEdTextBuilder` fixtures spanning core, association, subclass, extension, and descriptor scenarios.
- Integration: continue driving `FlatteningMetadataIntegration.test.ts`, extending coverage as new behaviour lands.
- Regression guard: once the sequence stabilises, add validation against the JSON schema and consider a lint rule to prevent string heuristics in the flattening folder.
