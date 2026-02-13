# New Spreadsheet Handbook

## User story

As a business analyst, I want a simple spreadsheet version of the handbook, so that I can easily filter, review, and compare outputs from multiple data standard versions.

## Requirements

- The spreadsheet should have three tabs:

  1. "Domains", with the following columns:
     1. Project Version
     2. Domain name
     3. Domain description
  2. "Entities", with the following columns:
     1. Project Version
     2. Domain name
     3. Domain entity name
     4. Domain entity description
  3. "Elements", with the following columns:
     1. Project Version
     2. Domain name
     3. Domain entity name
     4. Element name
     5. Element description
     6. Element data type

- The spreadsheet should be generated during the Build process, without output written to file "Data-Catalog.xlsx"

## Approach

- Add new code to the `metaed-plugin-edfi-handbook` package
- The file `EdFiDataHandbookAsExcelGenerator.ts` is similar.
  - Do not modify `EdFiDataHandbookAsExcelGenerator.ts`.
  - Copy `EdFiDataHandbookAsExcelGenerator.ts` to create the new module file.
  - Do not modify `EdFiDataHandbookAsExcelGenerator.ts`.

## Addendum

"Namespace" is also needed, but was overlooked in the original prompt above that was provided to GitHub Copilot.