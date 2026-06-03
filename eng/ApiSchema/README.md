# EdFi.ApiSchema

API Schema definition packages for the core Ed-Fi Data Standard and TPDM, Sample, and Homograph extensions.

These are **asset-only** NuGet packages — they contain loose files only (no DLL, no compiled code, no
embedded resources). See [PACKAGE-CONTRACT.md](PACKAGE-CONTRACT.md) for the full consumer contract and
[ASSET-PACK-SPIKE.md](ASSET-PACK-SPIKE.md) for the pack mechanics.

## Package Shape

After extracting a `.nupkg`, the schema payload is rooted at `contentFiles/any/any/ApiSchema/`:

```text
contentFiles/any/any/ApiSchema/
  package-manifest.json
  ApiSchema.json
  discovery-spec.json        (core packages only)
  xsd/                       (omitted for extensions without XSD, e.g. Homograph)
    *.xsd
docs/
  README.md
  LICENSE
```

There are no `lib/`, `ref/`, `*.dll`, `*.cs`, `bin/`, or `obj/` entries.

## Build Flow

All commands are in `eng/ApiSchema/build.ps1` and are invoked as:

```powershell
./eng/ApiSchema/build.ps1 -Command <CommandName> [parameters...]
```

### 1. `RunMetaEd` — Generate `MetaEdOutput`

Runs the MetaEd compiler against the config file to produce `MetaEdOutput/`. This is the unchanged source
of truth for all downstream packaging steps.

```powershell
./eng/ApiSchema/build.ps1 -Command RunMetaEd -SchemaPackagingConfigFile "<path-to-MetaEdConfig.json>"
```

### 2. `StageAssets` — Stage the flat ApiSchema payload

Creates an isolated per-package staging directory at `eng/ApiSchema/staging/<ExtensionName>/` containing
only the allow-listed assets:

- `ApiSchema.json` — schema JSON, normalized from `ApiSchema.json` (core) or `ApiSchema-EXTENSION.json`
  (extension). The file is always named `ApiSchema.json` in the staging directory.
- `xsd/` — XSD and Interchange files copied with their MetaEd-generated names (no extension-name prefix).
  Omitted for extensions that produce no XSD (e.g. Homograph).
- `discovery-spec.json` — curated discovery specification from `eng/ApiSchema/`; **required for core
  packages** (staging fails if missing); not included for extensions.

Missing schema JSON and a missing core `discovery-spec.json` are hard failures. Absent optional assets
(XSD, Interchange) are silently skipped.

```powershell
./eng/ApiSchema/build.ps1 -Command StageAssets -ExtensionName Core|TPDM|Sample|Homograph
```

### 3. `WriteManifest` — Write `package-manifest.json`

Reads project identity semantically from the staged `ApiSchema.json` (`projectSchema.projectName`,
`projectSchema.projectEndpointName`, `projectSchema.isExtensionProject`) and writes
`staging/<ExtensionName>/package-manifest.json`. Must be run after `StageAssets`.

> **Core requires `$env:DataStandardVersion`** — the NuGet `PackageId` for Core is
> `EdFi.DataStandard<Version>.ApiSchema` (e.g. `EdFi.DataStandard52.ApiSchema`), so
> `$env:DataStandardVersion` must be set before invoking `WriteManifest`, `Package`, or `Validate`
> for Core. Extensions do not include the version in their `PackageId` and do not need this variable.

```powershell
# Core requires the Data Standard short-version (e.g. 52) so the PackageId resolves to
# EdFi.DataStandard52.ApiSchema. Extensions do not need this.
$env:DataStandardVersion = '52'
./eng/ApiSchema/build.ps1 -Command WriteManifest -ExtensionName Core

# Extensions — no env var needed:
./eng/ApiSchema/build.ps1 -Command WriteManifest -ExtensionName TPDM|Sample|Homograph
```

The manifest fields are documented in [PACKAGE-CONTRACT.md](PACKAGE-CONTRACT.md#3-package-manifestjson-schema).

### 4. `Package` — Asset-only `dotnet pack`

Runs `dotnet pack` on the appropriate `.csproj` to produce the asset-only `.nupkg`. The `.csproj` sets
`<IncludeBuildOutput>false</IncludeBuildOutput>` and packs the staged `staging/<ExtensionName>/` tree under
`contentFiles/any/any/ApiSchema/`. Because these remain SDK-style projects, `dotnet pack` still performs a
transient (empty) compile to `bin/`; however, `<IncludeBuildOutput>false</IncludeBuildOutput>` guarantees the
compiled assembly is **never** included in the `.nupkg`, so the published package is DLL-free. The `bin/` and
`obj/` directories are gitignored and are not committed.

`$env:DataStandardVersion` is required for Core (see step 3 above). The script exits immediately with a
clear error if it is unset for Core, so no mis-named package is ever produced.

```powershell
# Core:
$env:DataStandardVersion = '52'
./eng/ApiSchema/build.ps1 Package -Version "1.0.<run_number>" -ExtensionName Core

# Extensions — no env var needed:
./eng/ApiSchema/build.ps1 Package -Version "1.0.<run_number>" -ExtensionName TPDM|Sample|Homograph
```

### 5. `Validate` — Assert the produced `.nupkg` matches the contract

Extracts the `.nupkg` and verifies all contract invariants: exactly one schema at the expected path,
parseable JSON, `package-manifest.json` present with all required fields and correct types, manifest path
targets exist, no duplicate paths, and no forbidden payload entries. Exits non-zero on any violation.

`$env:DataStandardVersion` is required for Core when `-PackageFile` is not provided (see step 3 above).

```powershell
# Core:
$env:DataStandardVersion = '52'
./eng/ApiSchema/build.ps1 -Command Validate -ExtensionName Core -Version "1.0.<run_number>"

# Extensions — no env var needed:
./eng/ApiSchema/build.ps1 -Command Validate -ExtensionName TPDM|Sample|Homograph -Version "1.0.<run_number>"
```

### 6. Push to Azure Artifacts

The CI `publish-package` job uses `InstallCredentialHandler` followed by `PushPackage` to push the
validated `.nupkg` artifact to the Azure Artifacts feed.

```powershell
# Install the NuGet credential provider (CI only):
./eng/ApiSchema/build.ps1 InstallCredentialHandler

# Push a package to the feed:
./eng/ApiSchema/build.ps1 PushPackage -EdFiNuGetFeed "<feed-url>" -NuGetApiKey "<key>" -PackageFile "<path>.nupkg"
```

## Local End-to-End Smoke Test (`Verify`)

The `Verify` command runs the full pipeline (StageAssets → WriteManifest → Package → Validate) for
Core, Sample, and Homograph using a synthetic `MetaEdOutput`, then asserts the produced `.nupkg` files
match the package contract. All temporary artifacts are cleaned up after the run.

```powershell
./eng/ApiSchema/build.ps1 -Command Verify
```

A clean `Verify` run prints `PASS: Core`, `PASS: Sample`, `PASS: Homograph`, and exits zero. Any
contract violation produces a clear failure message and exits non-zero.

## CI Workflow

The `api-schema-packaging.yml` workflow runs the following steps for each matrix entry
(Core/TPDM/Homograph/Sample × DS version):

1. **Stage ApiSchema Assets** — `StageAssets`
2. **Write Package Manifest** — `WriteManifest`
3. **API Schema Package - Create NuGet File** — `Package` (asset-only `dotnet pack`)
4. **Validate Package** — `Validate`
5. **Upload Package as Artifact**

The separate `publish-package` job then downloads the validated artifact and pushes it to the Azure
Artifacts feed using `InstallCredentialHandler` + `PushPackage`.

## Reference

- [PACKAGE-CONTRACT.md](PACKAGE-CONTRACT.md) — full consumer contract: package layout, `package-manifest.json`
  schema, and guarantees enforced by `Validate`.
- [ASSET-PACK-SPIKE.md](ASSET-PACK-SPIKE.md) — asset-only `dotnet pack` mechanics: csproj changes,
  staging model, and verification expectations.

## Legal Information

Copyright (c) 2025 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
