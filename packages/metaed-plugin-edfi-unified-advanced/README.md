# metaed-plugin-edfi-unified-advanced

MetaEd plugin that provides advanced validation rules for the unified model.

## Input Configuration

No plugin-specific configuration. This is a validators-only plugin.

## Output

No file artifacts. This plugin only reports validation failures when modeling rules
are violated.

## Business Logic

Adds advanced validation rules on top of the unified model, checking for correct usage
of merge directives, self-references, and common properties, and flagging deprecated
usage. Of its 13 validators, 7 report human-readable validation errors when modeling
constraints are violated; the other 6 report deprecation warnings (not errors) for
deprecated entities, extensions, subclasses, properties, domain item references, and
interchange item references. Deprecation warnings for non-extension namespaces are
reported only when `allianceMode` is enabled.
