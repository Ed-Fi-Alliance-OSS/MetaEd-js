# Spike: Asset-Only `dotnet pack` Mechanics

> **Status:** Completed — findings recorded here as input to Task 4 (csproj conversion).
> Empirical verification (producing a real `.nupkg`) must run in the `api-schema-packaging` CI job
> because `dotnet` and `pwsh` are NOT installed on the local dev machine.

## Recommendation

Use **SDK-style `.csproj` with `<IncludeBuildOutput>false</IncludeBuildOutput>`**.
Do NOT introduce a separate `.nuspec` file.

**Rationale:** The four `EdFi.*.ApiSchema.csproj` files already contain per-package metadata
(`PackageId`, title, description, summary, version, authors, license, README). A `.nuspec`
would duplicate that metadata and create a second source of truth. The SDK-style approach with
`IncludeBuildOutput=false` achieves the identical asset-only result while keeping metadata in one
place and following standard NuGet conventions.

## Staging Model (Model A)

The staging directory `eng/ApiSchema/staging/<ExtensionName>/` holds a **flat** payload:

```text
staging/<ExtensionName>/
  ApiSchema.json
  discovery-spec.json        (core only)
  package-manifest.json
  xsd/
    Ed-Fi-Core.xsd
    Interchange-Student.xsd
    ...
```

The staging directory does **NOT** itself contain a `contentFiles/...` path. The pack step adds
the `contentFiles/any/any/ApiSchema/` prefix exactly once.

## Exact csproj Changes (Task 4)

### Add to `<PropertyGroup>`

```xml
<IncludeBuildOutput>false</IncludeBuildOutput>
```

### Replace item groups

**Remove** these existing item groups:

```xml
<ItemGroup>
  <None Remove="*.json" />
</ItemGroup>

<ItemGroup>
  <EmbeddedResource Include="*.json" Exclude="xsd.json;dependencies.json" />
  <EmbeddedResource Include="xsd/*.xsd" />
</ItemGroup>
```

**Add** this item group:

```xml
<ItemGroup>
  <None Include="staging\$(ExtensionName)\**" Pack="true"
        PackagePath="contentFiles/any/any/ApiSchema/%(RecursiveDir)%(Filename)%(Extension)" />
</ItemGroup>
```

`%(RecursiveDir)` preserves the `xsd/` subdirectory automatically.

### Keep unchanged

```xml
<ItemGroup>
    <None Include="README.md" Pack="true" PackagePath="docs\" />
    <None Include="LICENSE" Pack="true" PackagePath="docs\" />
</ItemGroup>
```

## `unzip -l` Verification Expectations

A correctly built `.nupkg` inspected with `unzip -l <package>.nupkg` should show:

- All payload entries under a **single** `contentFiles/any/any/ApiSchema/` prefix — no duplication
  of that prefix.
- `xsd/` subdirectory preserved: e.g. `contentFiles/any/any/ApiSchema/xsd/Ed-Fi-Core.xsd`.
- `docs/README.md` and `docs/LICENSE` present.
- **No** `lib/`, `ref/`, `*.dll`, `*.cs`, `bin/`, or `obj/` entries.

## Gotchas

- `<None>` items default to `Pack="true"` in SDK-style projects; set it explicitly anyway for
  clarity.
- SDK-style asset-only packs do **NOT** need a `<contentFiles>` nuspec element — the `PackagePath`
  on the `<None>` item is sufficient.
- Use **forward slashes** in `PackagePath` values (NuGet convention); backslashes in `Include`
  paths are fine on Windows/MSBuild.
- The CI `dotnet pack` invocation must pass the same `$(ExtensionName)` MSBuild property so that
  `staging\$(ExtensionName)\**` resolves correctly (e.g. `-p:ExtensionName=Core`).
- The `<NoWarn>NU5110,NU5111,NU5128</NoWarn>` suppression in the csproj covers warnings about
  assemblies in a package (NU5110, NU5111) and the empty-dependency-group warning (NU5128). The
  primary resolution for NU5128 is `<SuppressDependenciesWhenPacking>true</SuppressDependenciesWhenPacking>`:
  NU5128 fires precisely because a dependency group exists with no matching `lib`/`ref` assemblies;
  suppressing the empty dependency group entirely is the correct fix for an asset-only package, with
  the `NU5128` NoWarn entry as belt-and-suspenders. Because these remain SDK-style projects, `dotnet
  pack` still performs a transient (empty) compile to `bin/` (no `.cs` files remain after `Marker.cs`
  was removed); `<IncludeBuildOutput>false</IncludeBuildOutput>` guarantees the compiled output is
  never included in the `.nupkg`, so the published package is DLL-free. The `bin/` and `obj/`
  directories are gitignored and are not committed.

## Empirical Verification Gate

`dotnet` and `pwsh` are absent on the local dev machine. The empirical confirmation — producing a
real `.nupkg` and running `unzip -l` against it — must be performed in the `api-schema-packaging`
CI job (Ubuntu runner, has both `dotnet` and `pwsh`). The recommendation above is grounded in
documented NuGet SDK behavior; CI is the authoritative confirmation gate.
