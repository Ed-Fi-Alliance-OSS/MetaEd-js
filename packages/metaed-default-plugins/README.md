# metaed-default-plugins

Convenience package that assembles the standard MetaEd plugin stack in the correct
dependency order.

## Input Configuration

None. This package has no runtime configuration of its own.

## Output

Exports `defaultPlugins(): MetaEdPlugin[]` which returns the canonical ordered list of
all standard MetaEd plugins, cached after first initialization.

## Business Logic

Imports and initializes the standard Ed-Fi plugins and returns them in the dependency order
required by the pipeline. The authoritative plugin order is in [`src/index.ts`](src/index.ts).
