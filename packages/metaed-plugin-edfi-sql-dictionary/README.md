# metaed-plugin-edfi-sql-dictionary

MetaEd plugin that generates an Excel SQL data dictionary from ODS table metadata.

## Input Configuration

No plugin-specific configuration. Depends on ODS table and column model data from
`metaed-plugin-edfi-ods-relational` and SQL Server-specific naming data (table names,
column names, data types) from `metaed-plugin-edfi-ods-sqlserver`.

## Output

Generates a single Excel workbook:

- `Documentation/DataDictionary/SqlDataDictionary.xlsx`

The workbook contains two sheets: Tables (table names and descriptions) and Columns
(column names, types, constraints per table).

## Business Logic

Collects ODS relational table and column metadata from all namespaces, sorts entries
alphabetically, and writes a two-sheet Excel data dictionary for documentation and
database review purposes.
