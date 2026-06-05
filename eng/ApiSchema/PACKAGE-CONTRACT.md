# ApiSchema NuGet Package Contract

> **Audience:** DMS bootstrap implementers consuming the published `EdFi.*.ApiSchema` NuGet packages
> (Stories 00/04/06 in the Data-Management-Service repo). This document is the stable, consumer-facing
> reference for the package layout and manifest schema.

## 1. Overview

The `EdFi.*.ApiSchema` NuGet packages are **asset-only** packages — they contain loose files only.
There are no DLL assemblies, compiled code, or embedded resources.

**How consumers must use these packages:**

- **Extract the `.nupkg` archive directly** (it is a ZIP file). Read files by path within the
  extracted directory tree. The DMS bootstrap `prepare-dms-schema.ps1` script (Story 06) performs
  this extraction to materialize the payload into the normalized filesystem workspace.
- **Do NOT rely on NuGet `PackageReference` content-file copy behavior.** The `contentFiles/any/any/`
  convention in the package is a structural path prefix used for NuGet compliance; it is not a signal
  to consume the package via SDK content-file copying. DMS runtime never reads from the `.nupkg` or
  the NuGet cache directly — bootstrap extracts it into the workspace first.
- After extraction, all reads go against the workspace directory; the package itself is not accessed
  further at runtime.

## 2. Package Layout

After extracting the `.nupkg`, the schema payload is rooted at:

```
contentFiles/any/any/ApiSchema/
```

The complete tree for a **core** package with XSD:

```text
contentFiles/any/any/ApiSchema/
  package-manifest.json
  ApiSchema.json
  discovery-spec.json
  xsd/
    *.xsd
docs/
  README.md
  LICENSE
```

The complete tree for an **extension** package with XSD:

```text
contentFiles/any/any/ApiSchema/
  package-manifest.json
  ApiSchema.json
  xsd/
    *.xsd
docs/
  README.md
  LICENSE
```

The complete tree for an **extension** package without XSD (e.g. Homograph):

```text
contentFiles/any/any/ApiSchema/
  package-manifest.json
  ApiSchema.json
docs/
  README.md
  LICENSE
```

**Package identity:**

- Every package ID is qualified with the data-standard version it was built against — core as
  `EdFi.DataStandard<dsv>.ApiSchema` and extensions as `EdFi.DataStandard<dsv>.<Extension>.ApiSchema`
  (e.g. `EdFi.DataStandard52.Sample.ApiSchema`). An extension built against different core data
  standards therefore produces distinct, independently resolvable packages (e.g. Sample on DS 5.2 vs
  DS 6.1) rather than colliding on a single id. Bootstrap (Story 06) resolves the extension package
  for a given data standard by this qualified id.

**Notes on optional files:**

- `discovery-spec.json` — present in **core packages only**; absent for all extension packages.
- `xsd/` directory — present when the MetaEd project produces XSD output; absent when the project
  provides no XSD (e.g. the Homograph extension). The `xsdDirectory` field in `package-manifest.json`
  is `null` when absent.
- The schema file is **always named `ApiSchema.json`** in the package, regardless of the MetaEd
  project type. When MetaEd generation produces `ApiSchema-EXTENSION.json` for an extension project,
  the packaging step normalizes the name to `ApiSchema.json`. The manifest and schema content
  identify whether the project is core or extension — consumers must not infer this from the filename.

## 3. `package-manifest.json` Schema

`package-manifest.json` is located at `contentFiles/any/any/ApiSchema/package-manifest.json`. It
provides enough metadata for DMS bootstrap to verify the package is asset-only, extract the payload,
and locate the schema and supporting files without guessing paths.

### Fields

| Field | Type | Description |
|---|---|---|
| `version` | integer | Package-manifest **format version**. Currently `1`. This is NOT the NuGet package version. |
| `packageId` | string | NuGet package identifier. Always qualified with the data-standard version: core is `EdFi.DataStandard<dsv>.ApiSchema` (e.g. `EdFi.DataStandard52.ApiSchema`); extensions are `EdFi.DataStandard<dsv>.<Extension>.ApiSchema` (e.g. `EdFi.DataStandard52.Sample.ApiSchema`). |
| `projectName` | string | Human-readable project name read from `ApiSchema.json` `projectSchema.projectName`, e.g. `Ed-Fi`, `Sample`. |
| `projectEndpointName` | string | URL-segment endpoint name read from `ApiSchema.json` `projectSchema.projectEndpointName`, e.g. `ed-fi`, `sample`. |
| `isExtensionProject` | boolean | `true` for extension packages; `false` for the core package. Read from `ApiSchema.json` `projectSchema.isExtensionProject`. |
| `schemaPath` | string | Path to the schema file, relative to the manifest's own directory. Always `"ApiSchema.json"`. |
| `discoverySpecPath` | string \| null | Path to the discovery specification file, relative to the manifest's own directory. `"discovery-spec.json"` for core packages; `null` for extension packages. |
| `xsdDirectory` | string \| null | Path to the XSD directory, relative to the manifest's own directory. `"xsd"` when XSD files are present; `null` when the project produces no XSD. |

All `*Path` and `*Directory` values are paths relative to the manifest's own directory (the
`contentFiles/any/any/ApiSchema/` root). When a field is `null`, the corresponding file or directory
is absent from the package — consumers must not attempt to access it.

The `version` field is a **format version** for the manifest itself (currently `1`). It is separate
from the NuGet package version (`1.0.<run_number>`), which appears only in the `.nupkg` metadata and
is never written into `package-manifest.json`.

### Core Package Example

A core Ed-Fi Data Standard 5.2 package with XSD:

```json
{
  "version": 1,
  "packageId": "EdFi.DataStandard52.ApiSchema",
  "projectName": "Ed-Fi",
  "projectEndpointName": "ed-fi",
  "isExtensionProject": false,
  "schemaPath": "ApiSchema.json",
  "discoverySpecPath": "discovery-spec.json",
  "xsdDirectory": "xsd"
}
```

### Extension Package Example (with XSD)

A Sample extension package with XSD:

```json
{
  "version": 1,
  "packageId": "EdFi.DataStandard52.Sample.ApiSchema",
  "projectName": "Sample",
  "projectEndpointName": "sample",
  "isExtensionProject": true,
  "schemaPath": "ApiSchema.json",
  "discoverySpecPath": null,
  "xsdDirectory": "xsd"
}
```

### Extension Package Example (without XSD)

A Homograph extension package — no XSD, no discovery spec:

```json
{
  "version": 1,
  "packageId": "EdFi.DataStandard52.Homograph.ApiSchema",
  "projectName": "Homograph",
  "projectEndpointName": "homograph",
  "isExtensionProject": true,
  "schemaPath": "ApiSchema.json",
  "discoverySpecPath": null,
  "xsdDirectory": null
}
```

## 4. Guarantees

The following are invariants enforced by the `Validate` command in `eng/ApiSchema/build.ps1`
(Task 5), which runs against the produced `.nupkg` before it is published:

- **No compiled output.** The package contains NO `lib/`, `ref/`, `*.dll`, `*.cs`, `bin/`, or `obj/`
  entries. This is structural — `IncludeBuildOutput=false` in the `.csproj` prevents the SDK from
  adding compiled output, and the `Validate` step asserts the absence of all forbidden path prefixes.
- **Exactly one schema file.** `contentFiles/any/any/ApiSchema/ApiSchema.json` is present and is
  parseable JSON.
- **Manifest is present and complete.** `package-manifest.json` is present, parseable, and contains
  all required fields with the correct types described in Section 3 above.
- **Manifest paths are valid.** Every non-null `schemaPath`, `discoverySpecPath`, and `xsdDirectory`
  value resolves to an existing entry within the package.
- **No duplicate paths.** No relative path appears more than once in the package entry list.

These guarantees mean that a consumer extracting the `.nupkg` can rely on the manifest to locate all
assets without defensive fallback logic. Any package that fails these checks is rejected before
publishing.

## 5. Cross-References

| Resource | Location |
|---|---|
| Authoritative package shape design | `Data-Management-Service` repo: `reference/design/backend-redesign/design-docs/bootstrap/apischema-container.md`, section "Published NuGet Shape" |
| DMS bootstrap workspace normalization (Story 00) | `reference/design/backend-redesign/epics/16-bootstrap/00-schema-and-security-selection.md` |
| DMS runtime content loading (Story 04) | `reference/design/backend-redesign/epics/16-bootstrap/04-apischema-runtime-content-loading.md` |
| DMS package extraction into workspace (Story 06) | `Data-Management-Service` repo — bootstrap Story 06 materializes this package payload into the normalized filesystem workspace via `prepare-dms-schema.ps1` |
| MetaEd packaging story and design decisions | `docs/stories/DMS-1155-metaed-apischema-asset-packaging.md` in this repo |
| Staging and manifest implementation | `eng/ApiSchema/build.ps1` — `StageAssets` and `WriteManifest` functions |
| `.csproj` asset-only pack mechanics | `eng/ApiSchema/ASSET-PACK-SPIKE.md` |
