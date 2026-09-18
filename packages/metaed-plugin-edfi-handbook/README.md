# metaed-plugin-edfi-handbook

MetaEd plugin that generates the Ed-Fi Data Handbook in HTML and Excel formats.

## Input Configuration

No plugin-specific configuration. Relies on model data enriched by upstream enhancers.

## Output

Generates two artifacts:

- `Documentation/Ed-Fi-Handbook/Ed-Fi-Data-Handbook-Index.html` — Interactive HTML
  single-page application for browsing handbook entries
- `Documentation/Ed-Fi-Handbook/Ed-Fi-Handbook.xlsx` — Excel workbook with the same
  content in spreadsheet form

## Business Logic

Enhances model metadata into handbook entries (entity descriptions, properties,
relationships), then emits both an HTML SPA index and an Excel workbook. Entries are
sorted and formatted for documentation and stakeholder review.
