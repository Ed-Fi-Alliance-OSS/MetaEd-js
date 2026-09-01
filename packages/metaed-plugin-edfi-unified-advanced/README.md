# metaed-plugin-edfi-unified-advanced

MetaEd plugin that provides advanced validation rules for the unified model.

## Input Configuration

No plugin-specific configuration. This is a validators-only plugin.

## Output

No file artifacts. This plugin only reports validation failures when modeling rules
are violated.

## Business Logic

Adds advanced validation rules on top of the unified model, checking for correct usage
of merge directives, self-references, common properties, and deprecated patterns.
Reports human-readable validation errors when modeling constraints are violated.
