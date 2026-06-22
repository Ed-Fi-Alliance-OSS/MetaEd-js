# metaed-plugin-edfi-xml-dictionary

MetaEd plugin that generates an Excel XML data dictionary from XSD schema structures.

## Input Configuration

No plugin-specific configuration. Depends on XSD model data produced by
`metaed-plugin-edfi-xsd`.

## Output

Generates a single Excel workbook:

- `DataDictionary/XmlDataDictionary.xlsx`

The workbook contains three sheets: Elements, Complex Types, and Simple Types.

## Business Logic

Traverses XSD-derived schema structures and exports a dictionary of XML types and
elements, including names, cardinality, restrictions, and relationships. Provides a
documentation view of the XML schema in spreadsheet form.
