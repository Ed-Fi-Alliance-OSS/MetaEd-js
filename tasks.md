# Flattening Metadata Task Checklist

## Shared Infrastructure
- [x] Document direct access patterns for MetaEd entity/ApiSchema data used by flattening helpers
- [x] Provide helper modules (`TableBuilder`, `ColumnFactory`, `ReferenceMapper`, `SqlTypeDeriver`) with branded types and immutable operations
- [x] Write unit tests covering helper behaviour

## FlatteningMetadataInitializerEnhancer
- [x] Refactor enhancer to derive root table names/flags from entity metadata without string heuristics
- [ ] Update enhancer to capture superclass identity context for downstream use
- [x] Write unit tests validating initializer behaviour for core, extension, and subclass entities

## FlatteningTableStructureEnhancer
- [x] Replace current collection analysis with recursive builder using `collectedApiProperties` and `allJsonPathsMapping`
- [x] Ensure extension subtrees and nested collections build accurate `childTables`
- [x] Write unit tests covering simple resources, nested collections, and extension scenarios

## FlatteningColumnBuilderEnhancer
- [ ] Reimplement column population using helper factories for root and child tables
- [ ] Guarantee parent reference columns and natural key propagation are emitted exactly once
- [ ] Write unit tests verifying scalar, identity, and parent reference column creation

## FlatteningReferenceEnhancer
- [ ] Implement foreign key column creation using `documentPathsMapping` and reference metadata
- [ ] Add polymorphic detection, discriminator creation, and descriptor handling without duplicating scalar logic
- [ ] Write unit tests covering simple references, polymorphic associations, and descriptors

## FlatteningTypeDecoratorEnhancer
- [ ] Enrich columns with `columnType`, `maxLength`, `precision`, and `scale` using ApiSchema signals
- [ ] Remove remaining name-based type inference and rely on helper lookups instead
- [ ] Write unit tests validating type decoration for booleans, dates, decimals, descriptors, and strings

## AbstractResourceFlatteningEnhancer
- [ ] Create new enhancer to populate `AbstractResourceFlatteningMetadata` and mark `discriminatorValue`
- [ ] Tag columns with `isSuperclassIdentity` by comparing to superclass identities
- [ ] Write unit tests for abstract resource metadata, subclass discriminator values, and superclass identity tagging

## PolymorphicReferenceEnhancer (Follow-up)
- [ ] Align existing enhancer with new metadata (validate discriminators, ensure `polymorphicType` assignments)
- [ ] Write unit tests verifying discriminator presence and superclass identity checks

## Enhancer Wiring
- [ ] Update `EnhancerList` ordering to reflect new/renamed enhancers
- [ ] Adjust exports/index files to match new enhancer names
- [ ] Write regression tests (or update existing ones) to ensure enhancer sequence executes without errors

## Testing & Validation
- [ ] Build end-to-end integration test that runs flattening enhancers on a representative MetaEd project
- [ ] Validate generated ApiSchema against the flattening JSON schema and add test assertion
- [ ] Add regression guard (lint rule or custom check) preventing string heuristics in flattening code
- [ ] Execute plugin against Ed-Fi reference project and record verification notes for key resource types

## Documentation & Review
- [ ] Update architecture or README notes describing the new enhancer flow and helper modules
- [ ] Prepare change summary and testing evidence for review once implementation is complete
