# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

# This script targets PowerShell 7+ (pwsh): it uses multi-argument Join-Path and other
# PowerShell 6+ syntax, and Verify shells out to `pwsh`. Windows PowerShell 5.1 is not supported.
#Requires -Version 7

[CmdLetBinding()]
param (
    [string]
    [ValidateSet("PushPackage", "Package", "RunMetaEd", "InstallCredentialHandler", "StageAssets", "WriteManifest", "Validate", "Verify")]
    $Command = "RunMetaEd",

    [string]
    $Version = "1.0.0",

    # Ed-Fi's official NuGet package feed for package download and distribution.
    # This value needs to be replaced with the config file
    [string]
    $EdFiNuGetFeed = "https://pkgs.dev.azure.com/ed-fi-alliance/Ed-Fi-Alliance-OSS/_packaging/EdFi/nuget/v3/index.json",

    # API key for accessing the feed above. Only required with with the Push
    # command.
    [string]
    $NuGetApiKey = "az",

    # Full path of a package file to push to the NuGet feed. Optional, only
    # applies with the Push command. If not set, then the script looks for a
    # NuGet package corresponding to the provided $DMSVersion and $BuildCounter.
    [string]
    $PackageFile,

    [switch]
    $DryRun,

    [string]
    $SchemaPackagingConfigFile,

    [string]
    $ExtensionName = ""
)

$solutionRoot = "$PSScriptRoot"
$applicationRoot = "$solutionRoot/"
if($ExtensionName -eq 'Core'){
    # For Core, this is the csproj file stem only — NOT the NuGet packageId.
    # The versioned core packageId (e.g. EdFi.DataStandard52.ApiSchema) is derived in WriteManifest from $env:DataStandardVersion.
    $projectName = "EdFi.DataStandard.ApiSchema"
}
else {
    $projectName = "EdFi.$ExtensionName.ApiSchema"
}

$projectPath = "$applicationRoot/$projectName.csproj"

# Fail the whole script with the native command's exit code when it is nonzero. PowerShell does NOT
# propagate a nested native command's $LASTEXITCODE as the script exit code (the top-level switch masks it),
# and $ErrorActionPreference='Stop' does not trap native failures — so check explicitly after each call.
function Assert-NativeSuccess {
    param([int] $ExitCode, [string] $CommandName)
    if ($ExitCode -ne 0) {
        Write-Error "$CommandName failed with exit code $ExitCode."
        exit $ExitCode
    }
}

# Computes the real NuGet PackageId from the extension name and the DataStandardVersion, mirroring
# the <PackageId> in each .csproj:
#   Core:       EdFi.DataStandard<dsv>.ApiSchema             (csproj: EdFi.DataStandard$(DataStandardVersion).ApiSchema)
#   Extensions: EdFi.DataStandard<dsv>.<ExtensionName>.ApiSchema
# DataStandardVersion is REQUIRED for both core and extensions (DMS-1155 D8): every published
# ApiSchema package qualifies its id with the data-standard version so that the same extension built
# against different core data standards (e.g. Sample on DS 5.2 vs 6.1) produces distinct, resolvable
# packages instead of colliding on one id+version on the immutable feed. This is the single source of
# truth for the packageId used by WriteManifest, Validate, and Verify.
function Get-ApiSchemaPackageId {
    param([string] $ExtensionName, [string] $DataStandardVersion)
    if (-not $DataStandardVersion) {
        Write-Error "Get-ApiSchemaPackageId: DataStandardVersion is required (e.g. '52') for '$ExtensionName' but is not set."
        exit 1
    }
    if ($ExtensionName -eq 'Core') {
        return "EdFi.DataStandard$DataStandardVersion.ApiSchema"
    }
    return "EdFi.DataStandard$DataStandardVersion.$ExtensionName.ApiSchema"
}

function InstallCredentialHandler {
    # Does the same as: iex "& { $(irm https://aka.ms/install-artifacts-credprovider.ps1) }"
    # but this brings support for installing the provider on Linux.
    # Additionally, it's less likely to hit GitHub rate limits because this downloads it directly, instead of making a
    # request to https://api.github.com/repos/Microsoft/artifacts-credprovider/releases/latest to infer the latest version.

    $downloadPath = Join-Path ([IO.Path]::GetTempPath()) 'cred-provider.zip'

    $credProviderUrl = 'https://github.com/microsoft/artifacts-credprovider/releases/download/v1.4.1/Microsoft.Net6.NuGet.CredentialProvider.zip'
    Write-Host "Downloading artifacts-credprovider from $credProviderUrl ..."
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($credProviderUrl, $downloadPath)

    Write-Host "Download complete."

    if (-not (Test-Path $downloadPath)) {
        throw "'$downloadPath' not found."
    }

    # The provider should be installed in the path: ~/.nuget/plugins/netcore/CredentialProvider.Microsoft/<binaries>
    Write-Host "Extracting $downloadPath ..."
    Expand-Archive -Force -Path $downloadPath -DestinationPath '~/.nuget/'
    Write-Host "The artifacts-credprovider was successfully installed" -ForegroundColor Green
}

function PushPackage {
    param (
        [Parameter(Mandatory=$true)]
        [string]
        $EdFiNuGetFeed,

        [Parameter(Mandatory=$true)]
        [string]
        $NuGetApiKey,

        [string]
        $PackageFile,
 
        [switch]
        $DryRun
    )

    if (-not $NuGetApiKey) {
        throw "Cannot push a NuGet package without providing an API key in the `NuGetApiKey` argument."
    }

    if (-not $EdFiNuGetFeed) {
        throw "Cannot push a NuGet package without providing a feed in the `EdFiNuGetFeed` argument."
    }

    Write-Output ">>>>> $PackageFile"

    if (-not $PackageFile) {
        # Local-use fallback only — CI always passes -PackageFile with the exact packed path.
        # Derive the DS-qualified filename from the real PackageId (mirrors each csproj's
        # EdFi.DataStandard<dsv>.<...>.ApiSchema, DMS-1155 D8); requires $env:DataStandardVersion.
        Write-Output "No PackageFile specified; deriving from the DS-qualified PackageId."
        $packageId = Get-ApiSchemaPackageId -ExtensionName $ExtensionName -DataStandardVersion $env:DataStandardVersion
        $PackageFile = "$PSScriptRoot/$packageId.$Version.nupkg"
        Write-Output "Package File: $PackageFile"
    }

    if ($DryRun) {
        Write-Output "Dry run enabled, not pushing package."
    }
    else {
        Write-Output "Pushing the NuGet Package $PackageFile to $EdFiNuGetFeed"
        dotnet nuget push $PackageFile --source $EdFiNuGetFeed --api-key $NuGetApiKey
        Assert-NativeSuccess -ExitCode $LASTEXITCODE -CommandName "dotnet nuget push ($PackageFile)"
    }
}

function BuildPackage {
    # Forward ExtensionName so staging\$(ExtensionName)\** resolves correctly.
    # DataStandardVersion is read from the environment by MSBuild automatically when set as an
    # env var (CI pattern), but we also forward it explicitly here so local and Verify runs work
    # without requiring the caller to set the env var separately.

    # Fail fast when DataStandardVersion is not set: the csproj PackageId is
    # <PackageId>EdFi.DataStandard$(DataStandardVersion).<...>.ApiSchema</PackageId> for BOTH core and
    # extensions (DMS-1155 D8), so an empty value silently produces a malformed id (e.g.
    # "EdFi.DataStandard.ApiSchema" or "EdFi.DataStandard..Sample.ApiSchema"). Required for all configs.
    if (-not $env:DataStandardVersion) {
        Write-Error "BuildPackage: DataStandardVersion environment variable is required (e.g. '52') for '$ExtensionName' but is not set. Set `$env:DataStandardVersion` before invoking Package."
        exit 1
    }

    $dsv = $env:DataStandardVersion
    $arguments = @(
        "-c", "release",
        "-p:PackageVersion=$Version",
        "-p:ExtensionName=$ExtensionName",
        "-p:DataStandardVersion=$dsv",
        "--output", $PSScriptRoot
    )
    dotnet pack $projectPath @arguments
    Assert-NativeSuccess -ExitCode $LASTEXITCODE -CommandName "dotnet pack ($projectName)"
}

function CopyPluginConfigurationFiles {
    # Copy the edfiApiSchema.config.json file to the core project directory

    # Parse the MetaEdConfig to get project paths
    $metaEdConfig = Get-Content -Path $SchemaPackagingConfigFile | ConvertFrom-Json
    $projectPaths = $metaEdConfig.metaEdConfiguration.projectPaths

    # Source configuration file path
    $sourceConfigPath = "$PSScriptRoot/../../packages/metaed-plugin-edfi-api-schema/test/integration/edfiApiSchema.config.json"

    if (Test-Path -Path $sourceConfigPath) {
        # Only copy to the first project path (core)
        if ($projectPaths.Count -gt 0) {
            $coreProjectPath = $projectPaths[0]
            if (Test-Path -Path $coreProjectPath) {
                $destinationPath = "$coreProjectPath/edfiApiSchema.config.json"
                Copy-Item -Path $sourceConfigPath -Destination $destinationPath -Force
                Write-Host "Copied edfiApiSchema.config.json to core: $destinationPath"
            }
            else {
                Write-Warning "Core project path not found: $coreProjectPath"
            }
        }
    }
    else {
        Write-Warning "Source configuration file not found: $sourceConfigPath"
    }
}

function RunMetaEd {
    # Run MetadEd Project
    npm config set registry https://registry.npmjs.org/
    npm cache clean --force
    npm install
    npm run build
    Set-Location -Path ./packages/metaed-console

    # Get Working Dir
    Get-Location
    Get-ChildItem

    # Copy plugin configuration files to project directories
    CopyPluginConfigurationFiles

    <#
    After building the project from the parent directory, we need to confirm
    it's functional using the following command, which will use the provided
    config file. For more details, please refer to the readme file located in
    ./packages/meteaed-console/src/README.md
    #>
    node ./dist/index.js -a -c $SchemaPackagingConfigFile
}

# StageAssets: Creates a flat per-package payload directory under eng/ApiSchema/staging/<ExtensionName>/
# containing only the allow-listed assets needed by the asset-only NuGet pack step (Task 4):
#   - ApiSchema.json    – schema JSON, normalized from ApiSchema.json (core) or ApiSchema-EXTENSION.json (extension)
#   - xsd/              – XSD and Interchange files copied with their MetaEd-generated names (no extension-name prefix)
#   - discovery-spec.json – curated discovery spec, REQUIRED for core packages; not included for extensions
# Missing schema JSON is always a hard failure. A missing core discovery-spec.json is also a hard failure.
# Absent optional assets (XSD, Interchange) are silently skipped. Forbidden files (dependencies.json, xsd.json,
# swagger JSON) are never copied. The staging directory is cleaned and recreated on each run so reruns are
# deterministic. The staging path is deterministic (eng/ApiSchema/staging/<ExtensionName>/) so downstream
# commands (e.g. Task 3 WriteManifest, Task 4 dotnet pack) can reference it without needing a separate parameter.
function StageAssets {
    # Determine the MetaEdOutput project directory name.
    # Core maps to 'EdFi'; extensions use the extension name directly (e.g. TPDM, Sample, Homograph).
    if ($ExtensionName -eq 'Core') {
        $metaEdProjectDir = 'EdFi'
    }
    else {
        $metaEdProjectDir = $ExtensionName
    }

    # Staging directory: eng/ApiSchema/staging/<ExtensionName>/
    # This is the flat ApiSchema payload root (Model A). The pack step adds the
    # contentFiles/any/any/ApiSchema/ prefix exactly once — it does NOT live here.
    $stagingDir = Join-Path $solutionRoot "staging" $ExtensionName

    # Clean and recreate the staging directory so reruns are fully deterministic.
    if (Test-Path -Path $stagingDir) {
        Remove-Item -Path $stagingDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null
    Write-Host "Staging directory: $stagingDir"

    # --- Schema JSON (required) ---
    # Core uses ApiSchema.json; extensions use ApiSchema-EXTENSION.json.
    # In both cases the destination is normalized to ApiSchema.json.
    if ($ExtensionName -eq 'Core') {
        $schemaSourcePath = Join-Path "." "MetaEdOutput" $metaEdProjectDir "ApiSchema" "ApiSchema.json"
    }
    else {
        $schemaSourcePath = Join-Path "." "MetaEdOutput" $metaEdProjectDir "ApiSchema" "ApiSchema-EXTENSION.json"
    }

    if (-not (Test-Path -Path $schemaSourcePath)) {
        Write-Error "Required schema JSON not found at '$schemaSourcePath'. Cannot stage assets for '$ExtensionName'."
        exit 1
    }

    $schemaDestPath = Join-Path $stagingDir "ApiSchema.json"
    Copy-Item -Path $schemaSourcePath -Destination $schemaDestPath
    Write-Host "Staged schema: $schemaDestPath"

    # --- XSD and Interchange files (optional) ---
    # Copied into <staging>/xsd/ preserving the MetaEd-generated file names.
    # NO extension-name prefix is added (unlike the old CopyMetaEdFiles logic).
    $xsdSourceDir = Join-Path "." "MetaEdOutput" $metaEdProjectDir "XSD"
    $interchangeSourceDir = Join-Path "." "MetaEdOutput" $metaEdProjectDir "Interchange"
    $xsdDestDir = Join-Path $stagingDir "xsd"

    $hasXsdOrInterchange = (Test-Path -Path $xsdSourceDir) -or (Test-Path -Path $interchangeSourceDir)

    if ($hasXsdOrInterchange) {
        New-Item -ItemType Directory -Path $xsdDestDir -Force | Out-Null

        # Both XSD/ and Interchange/ collapse into the single staging xsd/ directory under their
        # original names. Guard against a same-named file in both sources: a silent overwrite would
        # drop a schema file BEFORE packing, where the package's duplicate-path check can no longer
        # see it (the package would validate green with a file missing). Fail fast instead.
        if (Test-Path -Path $xsdSourceDir) {
            Get-ChildItem -Path $xsdSourceDir -File | ForEach-Object {
                $destFile = Join-Path $xsdDestDir $_.Name
                if (Test-Path -Path $destFile) {
                    Write-Error "Duplicate staged xsd name '$($_.Name)' for '$ExtensionName' (collision within XSD/ sources)."
                    exit 1
                }
                Copy-Item -Path $_.FullName -Destination $destFile
                Write-Host "Staged XSD: $destFile"
            }
        }

        if (Test-Path -Path $interchangeSourceDir) {
            Get-ChildItem -Path $interchangeSourceDir -File | ForEach-Object {
                $destFile = Join-Path $xsdDestDir $_.Name
                if (Test-Path -Path $destFile) {
                    Write-Error "Duplicate staged xsd name '$($_.Name)' for '$ExtensionName' (XSD/ and Interchange/ produce the same file name)."
                    exit 1
                }
                Copy-Item -Path $_.FullName -Destination $destFile
                Write-Host "Staged Interchange: $destFile"
            }
        }
    }
    else {
        Write-Host "No XSD or Interchange source directories found for '$ExtensionName' — skipping xsd/ staging."
    }

    # --- discovery-spec.json (core only, required for core) ---
    # This is a curated file checked into eng/ApiSchema/; it is only included for core packages.
    # Core packages REQUIRE this file per the package contract; staging fails if it is missing.
    if ($ExtensionName -eq 'Core') {
        $discoverySpecSource = Join-Path $solutionRoot "discovery-spec.json"
        if (Test-Path -Path $discoverySpecSource) {
            $discoverySpecDest = Join-Path $stagingDir "discovery-spec.json"
            Copy-Item -Path $discoverySpecSource -Destination $discoverySpecDest
            Write-Host "Staged discovery-spec: $discoverySpecDest"
        }
        else {
            Write-Error "Required discovery-spec.json not found at '$discoverySpecSource'. Core packages require this file per the package contract. Ensure eng/ApiSchema/discovery-spec.json is present."
            exit 1
        }
    }

    Write-Host "StageAssets complete for '$ExtensionName'. Payload directory: $stagingDir"
}

<#
.SYNOPSIS
    Writes package-manifest.json into the staging directory for the current extension.

.DESCRIPTION
    Reads project identity (projectName, projectEndpointName, isExtensionProject) SEMANTICALLY
    from the staged ApiSchema.json at .projectSchema.* rather than inferring anything from
    $ExtensionName or the script's $projectName variable.

    The manifest shape is:
      {
        "version": 1,              -- FORMAT version constant, NOT the NuGet package version
        "packageId": "<string>",   -- NuGet package ID; for core this is "EdFi.DataStandard<Version>.ApiSchema"
                                      (e.g. "EdFi.DataStandard52.ApiSchema") and for extensions it is
                                      "EdFi.DataStandard<Version>.<Extension>.ApiSchema" (e.g.
                                      "EdFi.DataStandard52.Sample.ApiSchema"), where <Version> comes from
                                      $env:DataStandardVersion (DMS-1155 D8)
        "projectName": "<string>", -- from ApiSchema.json projectSchema.projectName
        "projectEndpointName": "<string>", -- from ApiSchema.json projectSchema.projectEndpointName
        "isExtensionProject": <bool>,      -- from ApiSchema.json projectSchema.isExtensionProject
        "schemaPath": "ApiSchema.json",    -- constant; the staged schema filename
        "discoverySpecPath": "discovery-spec.json" | null, -- present only if the file exists in staging
        "xsdDirectory": "xsd" | null       -- present only if staging/xsd/ exists and is non-empty
      }

    The manifest is written to <staging>/package-manifest.json, which the downstream NuGet pack
    step (Task 4) places at contentFiles/any/any/ApiSchema/package-manifest.json in the package.

    Prerequisite: StageAssets must have been run first so that <staging>/ApiSchema.json exists.
#>
function WriteManifest {
    # Staging directory matches the convention set by StageAssets.
    $stagingDir = Join-Path $solutionRoot "staging" $ExtensionName

    # Read project identity SEMANTICALLY from the staged schema.
    $stagedSchemaPath = Join-Path $stagingDir "ApiSchema.json"
    if (-not (Test-Path -Path $stagedSchemaPath)) {
        Write-Error "Staged ApiSchema.json not found at '$stagedSchemaPath'. Run StageAssets first."
        exit 1
    }

    $apiSchema = Get-Content -Path $stagedSchemaPath -Raw | ConvertFrom-Json
    $schemaProjectName      = $apiSchema.projectSchema.projectName
    $schemaEndpointName     = $apiSchema.projectSchema.projectEndpointName
    $schemaIsExtension      = $apiSchema.projectSchema.isExtensionProject

    # packageId is the real NuGet package identifier. For BOTH core and extensions it includes the
    # DataStandardVersion (e.g. "EdFi.DataStandard52.ApiSchema", "EdFi.DataStandard52.Sample.ApiSchema"),
    # matching each csproj's <PackageId>EdFi.DataStandard$(DataStandardVersion).<...>.ApiSchema</PackageId>
    # (DMS-1155 D8). $projectName (set at script top from $ExtensionName) only locates the UNVERSIONED
    # csproj FILE — it must NOT be used as the manifest packageId. Computed via the shared helper.
    $packageId = Get-ApiSchemaPackageId -ExtensionName $ExtensionName -DataStandardVersion $env:DataStandardVersion

    # schemaPath is always the normalised filename used in staging.
    $schemaPath = "ApiSchema.json"

    # discoverySpecPath: set only when the file is present in staging.
    $discoverySpecFile = Join-Path $stagingDir "discovery-spec.json"
    if (Test-Path -Path $discoverySpecFile) {
        $discoverySpecPath = "discovery-spec.json"
    }
    else {
        $discoverySpecPath = $null
    }

    # xsdDirectory: set only when the xsd/ subdirectory exists AND contains at least one file.
    $xsdDir = Join-Path $stagingDir "xsd"
    if ((Test-Path -Path $xsdDir) -and ((Get-ChildItem -Path $xsdDir -File | Measure-Object).Count -gt 0)) {
        $xsdDirectory = "xsd"
    }
    else {
        $xsdDirectory = $null
    }

    # Build the manifest object. PowerShell ConvertTo-Json renders $true/$false as JSON
    # booleans and $null as JSON null, so no special handling is needed.
    $manifest = [ordered]@{
        version             = 1
        packageId           = $packageId
        projectName         = $schemaProjectName
        projectEndpointName = $schemaEndpointName
        isExtensionProject  = $schemaIsExtension
        schemaPath          = $schemaPath
        discoverySpecPath   = $discoverySpecPath
        xsdDirectory        = $xsdDirectory
    }

    $manifestPath = Join-Path $stagingDir "package-manifest.json"
    $manifest | ConvertTo-Json -Depth 5 | Set-Content -Path $manifestPath -Encoding utf8
    Write-Host "WriteManifest complete. Manifest written to: $manifestPath"
}

<#
.SYNOPSIS
    Validates the produced .nupkg against the asset-only package contract.

.DESCRIPTION
    Opens the specified .nupkg (which is a ZIP archive) in-memory using
    System.IO.Compression.ZipArchive and asserts all of the following invariants, exiting with
    code 1 and a clear message on the first violation:

    1. Exactly one schema JSON exists at contentFiles/any/any/ApiSchema/ApiSchema.json.
    2. That schema JSON is parseable JSON.
    3. package-manifest.json is present at contentFiles/any/any/ApiSchema/package-manifest.json,
       is parseable JSON, and contains ALL required fields with correct types:
         - version       : number equal to 1
         - packageId     : non-empty string that matches the <id> in the .nuspec inside the package
         - projectName   : non-empty string
         - projectEndpointName : non-empty string
         - isExtensionProject  : boolean
         - schemaPath    : string equal to "ApiSchema.json"
         - discoverySpecPath   : string or null
         - xsdDirectory  : string or null
    4. When non-null, the manifest schemaPath / discoverySpecPath / xsdDirectory targets exist
       inside the package (resolved relative to contentFiles/any/any/ApiSchema/), and
       schemaPath resolves to the single schema JSON above.
    5. No duplicate relative paths within the package.
    6. All package entries pass a positive allow-list: standard NuGet metadata (_rels/.rels,
       [Content_Types].xml, *.nuspec, package/services/metadata/core-properties/*.psmdcp),
       docs/README.md, docs/LICENSE, and the ApiSchema payload files under
       contentFiles/any/any/ApiSchema/ (ApiSchema.json, package-manifest.json,
       discovery-spec.json, xsd/<file>). Any entry not on the allow-list fails validation
       with a clear message naming the offending entry. This approach inherently rejects lib/,
       ref/, bin/, obj/ at any nesting depth, as well as *.dll, *.cs, *.pdb, *.exe, *.snupkg,
       and any other stray file without requiring an exhaustive denylist.
    7. packageId in package-manifest.json must equal the <id> element in the .nuspec entry inside
       the .nupkg (case-insensitive), confirming that the manifest identity matches the real NuGet
       package identity.
    8. discovery-spec.json core/extension contract:
         - Core packages (isExtensionProject false): discoverySpecPath must be non-null AND the
           discovery-spec.json entry must exist in the package.
         - Extension packages (isExtensionProject true): discoverySpecPath must be null AND there
           must be no contentFiles/any/any/ApiSchema/discovery-spec.json entry in the package.

    The .nupkg to validate is resolved as follows:
      - If -PackageFile is provided, that path is used directly (always preferred).
      - Otherwise the script computes the expected filename from the real NuGet PackageId
        (via Get-ApiSchemaPackageId), using $env:DataStandardVersion:
          * For Core: EdFi.DataStandard<dsv>.ApiSchema.<Version>.nupkg
          * For extensions: EdFi.DataStandard<dsv>.<Ext>.ApiSchema.<Version>.nupkg
      - If the computed file does not exist, validation fails with a clear error — there is NO
        blind "first *.nupkg" fallback. This prevents accidentally validating a stale or wrong
        package (e.g. a pre-existing net10-local.nupkg) when the expected file is absent.

    The function uses System.IO.Compression.ZipArchive to read archive entries in-memory
    cross-platform. No files are extracted to disk and no temporary directory is created.

.PARAMETER PackageFile
    Optional full path to the .nupkg to validate. When provided, used as-is. When omitted,
    the expected filename is computed from the real NuGet PackageId (see description above).
#>
function Validate {
    # ---- resolve the .nupkg to inspect ----
    # Strategy: always use -PackageFile when provided (CI passes the exact packed path).
    # Otherwise compute the expected filename from the real NuGet PackageId so that we
    # validate the correct package — NOT a blind first-*.nupkg fallback which can grab
    # a stale or wrong package (e.g. a pre-existing net10-local.nupkg locally).
    $nupkgPath = $PackageFile
    if (-not $nupkgPath) {
        # Compute the real NuGet PackageId for the expected filename via the shared helper, which
        # includes the DataStandardVersion for both core and extensions (mirrors each csproj's
        # <PackageId>EdFi.DataStandard$(DataStandardVersion).<...>.ApiSchema</PackageId>, DMS-1155 D8).
        $expectedPackageId = Get-ApiSchemaPackageId -ExtensionName $ExtensionName -DataStandardVersion $env:DataStandardVersion
        $nupkgPath = Join-Path $PSScriptRoot "$expectedPackageId.$Version.nupkg"
    }
    if (-not (Test-Path -Path $nupkgPath)) {
        # No blind fallback — failing with a clear message is safer than silently
        # validating an arbitrary .nupkg that happens to be in the directory.
        Write-Error "Validate: expected .nupkg not found at '$nupkgPath'. Provide -PackageFile with the exact path, or ensure the computed filename exists in $PSScriptRoot."
        exit 1
    }
    Write-Host "Validating package: $nupkgPath"

    # ---- load the ZIP entries via System.IO.Compression ----
    # Wrap archive open + all entry reads in try/finally so the handles are always
    # disposed even when the archive is corrupt/truncated or an unexpected exception
    # is thrown mid-validation. Assert-Condition already disposes on contract failures;
    # the outer try/finally covers throw paths that bypass Assert-Condition.
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    $zipStream  = $null
    $zipArchive = $null
    try {
        $zipStream  = [System.IO.File]::OpenRead($nupkgPath)
        $zipArchive = [System.IO.Compression.ZipArchive]::new($zipStream, [System.IO.Compression.ZipArchiveMode]::Read)
    } catch {
        if ($null -ne $zipArchive) { $zipArchive.Dispose() }
        if ($null -ne $zipStream)  { $zipStream.Dispose() }
        Write-Error "Validate: failed to open '$nupkgPath' as a ZIP archive (file may be corrupt or truncated): $_"
        exit 1
    }

    try {

    # Collect all entry full names (forward-slash, as stored in the ZIP).
    $allEntries = @($zipArchive.Entries | ForEach-Object { $_.FullName })

    # Helper: read a text entry by its exact path (case-insensitive match).
    function Read-ZipEntry ([System.IO.Compression.ZipArchive]$archive, [string]$entryPath) {
        $entry = $archive.Entries | Where-Object { $_.FullName -ieq $entryPath } | Select-Object -First 1
        if (-not $entry) { return $null }
        $reader = [System.IO.StreamReader]::new($entry.Open())
        try { return $reader.ReadToEnd() }
        finally { $reader.Dispose() }
    }

    # ---- assertion helper — closes the archive and exits 1 ----
    function Assert-Condition ([bool]$condition, [string]$message) {
        if (-not $condition) {
            $zipArchive.Dispose()
            $zipStream.Dispose()
            Write-Error "VALIDATION FAILED: $message"
            exit 1
        }
    }

    # ---- 5. No duplicate relative paths ----
    $lowerEntries = $allEntries | ForEach-Object { $_.ToLowerInvariant() }
    $duplicates   = @($lowerEntries | Group-Object | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name)
    Assert-Condition ($duplicates.Count -eq 0) "Duplicate entries found in package: $($duplicates -join ', ')"

    # ---- 6. Positive allow-list: every package entry must be an explicitly permitted path ----
    # Approach: positive allow-list (preferred over a denylist) so that any unexpected entry —
    # whether it is a *.pdb, *.exe, *.snupkg, a nested bin/ or obj/ directory, a stray
    # *.dll/*.cs, or any other file not in the contract — is rejected with a clear message.
    # A denylist alternative would require enumerating every forbidden pattern and is trivially
    # defeated by new file types; the allow-list is exhaustive by construction.
    #
    # Permitted entries (case-insensitive):
    #   Standard NuGet metadata (produced by every `dotnet pack`):
    #     _rels/.rels
    #     [Content_Types].xml
    #     <PackageId>.nuspec                         (root-level *.nuspec, no path separator)
    #     package/services/metadata/core-properties/*.psmdcp
    #   Documentation:
    #     docs/README.md
    #     docs/LICENSE
    #   ApiSchema payload under contentFiles/any/any/ApiSchema/:
    #     ApiSchema.json
    #     package-manifest.json
    #     discovery-spec.json                        (core only; extension packages omit this)
    #     xsd/<filename>.xsd                         (one level deep, .xsd files only)
    $allowListPatterns = @(
        '^_rels/\.rels$',
        '^\[Content_Types\]\.xml$',
        '^[^/]+\.nuspec$',
        '^package/services/metadata/core-properties/[^/]+\.psmdcp$',
        '^docs/README\.md$',
        '^docs/LICENSE$',
        '^contentFiles/any/any/ApiSchema/ApiSchema\.json$',
        '^contentFiles/any/any/ApiSchema/package-manifest\.json$',
        '^contentFiles/any/any/ApiSchema/discovery-spec\.json$',
        '^contentFiles/any/any/ApiSchema/xsd/[^/]+\.xsd$'
    )
    # Directory entries (names ending in '/') carry no content; the file-oriented
    # allow-list would skip them via the EndsWith('/') guard below. That guard,
    # however, creates a hole: forbidden directories such as lib/, ref/, bin/, or
    # obj/ would pass unchecked. The segment-anchored denylist below closes that
    # hole by applying to EVERY entry (file AND directory) before the guard runs.
    # It complements — not replaces — the positive allow-list above.
    $forbiddenSegmentPattern = '(^|/)(lib|ref|bin|obj)/'
    foreach ($entry in $allEntries) {
        Assert-Condition (-not ($entry -imatch $forbiddenSegmentPattern)) "Package entry '$entry' contains a forbidden directory segment (lib/, ref/, bin/, or obj/). The asset-only package must contain no compiled-output directories (PACKAGE-CONTRACT.md)."
        if ($entry.EndsWith('/')) { continue }
        $matched = $false
        foreach ($pattern in $allowListPatterns) {
            if ($entry -imatch $pattern) {
                $matched = $true
                break
            }
        }
        Assert-Condition $matched "Package entry '$entry' is not permitted by the allow-list. Only standard NuGet metadata, docs/README.md, docs/LICENSE, and the ApiSchema payload files (ApiSchema.json, package-manifest.json, discovery-spec.json, xsd/<file>.xsd) are allowed. Remove this entry from the staging directory or update the allow-list if the entry is intentionally new."
    }

    # ---- docs presence: docs/README.md and docs/LICENSE must be present (PACKAGE-CONTRACT.md) ----
    $docsReadmeExists  = $null -ne ($allEntries | Where-Object { $_ -ieq 'docs/README.md' })
    $docsLicenseExists = $null -ne ($allEntries | Where-Object { $_ -ieq 'docs/LICENSE' })
    Assert-Condition $docsReadmeExists  "Required entry 'docs/README.md' not found in package (PACKAGE-CONTRACT.md)."
    Assert-Condition $docsLicenseExists "Required entry 'docs/LICENSE' not found in package (PACKAGE-CONTRACT.md)."

    # ---- 1. Exactly one schema JSON ----
    $schemaEntryPath = 'contentFiles/any/any/ApiSchema/ApiSchema.json'
    $schemaEntries   = @($allEntries | Where-Object { $_ -ieq $schemaEntryPath })
    Assert-Condition ($schemaEntries.Count -eq 1) "Expected exactly one entry at '$schemaEntryPath' but found $($schemaEntries.Count)."

    # ---- 2. Schema JSON is parseable ----
    $schemaText = Read-ZipEntry $zipArchive $schemaEntryPath
    Assert-Condition ($null -ne $schemaText) "Could not read entry '$schemaEntryPath' from package."
    try {
        $null = $schemaText | ConvertFrom-Json
    }
    catch {
        Assert-Condition $false "Schema JSON at '$schemaEntryPath' is not valid JSON: $_"
    }

    # ---- 3. package-manifest.json present and well-formed ----
    $manifestEntryPath = 'contentFiles/any/any/ApiSchema/package-manifest.json'
    $manifestEntries   = @($allEntries | Where-Object { $_ -ieq $manifestEntryPath })
    Assert-Condition ($manifestEntries.Count -ge 1) "Required entry '$manifestEntryPath' not found in package."

    $manifestText = Read-ZipEntry $zipArchive $manifestEntryPath
    Assert-Condition ($null -ne $manifestText) "Could not read entry '$manifestEntryPath' from package."

    $manifest = $null
    try {
        $manifest = $manifestText | ConvertFrom-Json
    }
    catch {
        Assert-Condition $false "package-manifest.json is not valid JSON: $_"
    }

    # Required fields type checks.
    # NOTE: ConvertFrom-Json in PowerShell 7 returns Int64 for JSON integers and System.Boolean for
    # JSON booleans. The numeric check accepts the full numeric set defensively (the value is also
    # compared to 1 below regardless of concrete numeric type).

    # version: number == 1
    Assert-Condition ($null -ne $manifest.version) "manifest field 'version' is missing."
    $versionType = $manifest.version.GetType().Name
    Assert-Condition ($versionType -in @('Int32','Int64','Double','Decimal')) "manifest field 'version' must be a number but is $versionType ('$($manifest.version)')."
    Assert-Condition ([int]$manifest.version -eq 1) "manifest field 'version' must equal 1 but is '$($manifest.version)'."

    # packageId: non-empty string
    Assert-Condition ($null -ne $manifest.packageId) "manifest field 'packageId' is missing."
    Assert-Condition ($manifest.packageId.GetType().Name -eq 'String') "manifest field 'packageId' must be a string but is $($manifest.packageId.GetType().Name)."
    Assert-Condition ($manifest.packageId.Trim().Length -gt 0) "manifest field 'packageId' must be a non-empty string."

    # ---- 7. packageId cross-check: manifest packageId must match the .nuspec <id> ----
    # Every .nupkg contains a top-level <PackageId>.nuspec entry whose <package><metadata><id> is
    # the authoritative NuGet package identity. Assert that manifest.packageId matches this value
    # (case-insensitive, consistent with NuGet id comparison semantics). This catches the class of
    # bug where the manifest was written with the wrong packageId (e.g. unversioned core id).
    $nuspecEntry = $zipArchive.Entries | Where-Object { $_.FullName -match '\.nuspec$' } | Select-Object -First 1
    Assert-Condition ($null -ne $nuspecEntry) "No .nuspec entry found inside the package. The package may be malformed."
    $nuspecText = $null
    $nuspecReader = [System.IO.StreamReader]::new($nuspecEntry.Open())
    try { $nuspecText = $nuspecReader.ReadToEnd() }
    finally { $nuspecReader.Dispose() }
    Assert-Condition ($null -ne $nuspecText -and $nuspecText.Length -gt 0) "Could not read .nuspec content from the package."
    $nuspecXml = [xml]$nuspecText
    $idNode   = $nuspecXml.SelectSingleNode("/*[local-name()='package']/*[local-name()='metadata']/*[local-name()='id']")
    $nuspecId = if ($null -ne $idNode) { $idNode.InnerText } else { "" }
    Assert-Condition ($null -ne $nuspecId -and $nuspecId.Trim().Length -gt 0) ".nuspec <id> element is missing or empty."
    Assert-Condition ([string]::Compare($manifest.packageId, $nuspecId, [System.StringComparison]::OrdinalIgnoreCase) -eq 0) "manifest packageId '$($manifest.packageId)' does not match the .nuspec <id> '$nuspecId'. The manifest and the actual NuGet package identity must agree."

    # projectName: non-empty string
    Assert-Condition ($null -ne $manifest.projectName) "manifest field 'projectName' is missing."
    Assert-Condition ($manifest.projectName.GetType().Name -eq 'String') "manifest field 'projectName' must be a string but is $($manifest.projectName.GetType().Name)."
    Assert-Condition ($manifest.projectName.Trim().Length -gt 0) "manifest field 'projectName' must be a non-empty string."

    # projectEndpointName: non-empty string
    Assert-Condition ($null -ne $manifest.projectEndpointName) "manifest field 'projectEndpointName' is missing."
    Assert-Condition ($manifest.projectEndpointName.GetType().Name -eq 'String') "manifest field 'projectEndpointName' must be a string but is $($manifest.projectEndpointName.GetType().Name)."
    Assert-Condition ($manifest.projectEndpointName.Trim().Length -gt 0) "manifest field 'projectEndpointName' must be a non-empty string."

    # isExtensionProject: boolean
    Assert-Condition ($null -ne $manifest.isExtensionProject) "manifest field 'isExtensionProject' is missing."
    $isExtType = $manifest.isExtensionProject.GetType().Name
    Assert-Condition ($isExtType -eq 'Boolean') "manifest field 'isExtensionProject' must be a boolean but is $isExtType ('$($manifest.isExtensionProject)')."

    # schemaPath: string == "ApiSchema.json"
    Assert-Condition ($null -ne $manifest.schemaPath) "manifest field 'schemaPath' is missing."
    Assert-Condition ($manifest.schemaPath.GetType().Name -eq 'String') "manifest field 'schemaPath' must be a string but is $($manifest.schemaPath.GetType().Name)."
    Assert-Condition ($manifest.schemaPath -eq 'ApiSchema.json') "manifest field 'schemaPath' must equal 'ApiSchema.json' but is '$($manifest.schemaPath)'."

    # discoverySpecPath: string or null (PSCustomObject does not include missing keys as properties;
    # use PSObject.Properties to distinguish "key present and null" from "key absent").
    $hasDiscoverySpecPath = $null -ne ($manifest.PSObject.Properties | Where-Object { $_.Name -eq 'discoverySpecPath' })
    Assert-Condition $hasDiscoverySpecPath "manifest field 'discoverySpecPath' is missing (must be a string or null)."
    if ($null -ne $manifest.discoverySpecPath) {
        Assert-Condition ($manifest.discoverySpecPath.GetType().Name -eq 'String') "manifest field 'discoverySpecPath' must be a string or null but is $($manifest.discoverySpecPath.GetType().Name)."
    }

    # xsdDirectory: string or null
    $hasXsdDirectory = $null -ne ($manifest.PSObject.Properties | Where-Object { $_.Name -eq 'xsdDirectory' })
    Assert-Condition $hasXsdDirectory "manifest field 'xsdDirectory' is missing (must be a string or null)."
    if ($null -ne $manifest.xsdDirectory) {
        Assert-Condition ($manifest.xsdDirectory.GetType().Name -eq 'String') "manifest field 'xsdDirectory' must be a string or null but is $($manifest.xsdDirectory.GetType().Name)."
    }

    # ---- 4. Manifest path targets exist in the package when non-null ----
    $apiSchemaBase = 'contentFiles/any/any/ApiSchema'

    # schemaPath must resolve to the single schema JSON already verified above.
    $resolvedSchemaPath = "$apiSchemaBase/$($manifest.schemaPath)"
    Assert-Condition ($resolvedSchemaPath -ieq $schemaEntryPath) "manifest schemaPath '$($manifest.schemaPath)' resolves to '$resolvedSchemaPath' which does not match the expected schema entry '$schemaEntryPath'."
    $schemaTargetExists = $null -ne ($allEntries | Where-Object { $_ -ieq $resolvedSchemaPath })
    Assert-Condition $schemaTargetExists "manifest schemaPath target '$resolvedSchemaPath' does not exist in the package."

    # discoverySpecPath: when non-null, the file must exist.
    if ($null -ne $manifest.discoverySpecPath) {
        $resolvedDiscoveryPath = "$apiSchemaBase/$($manifest.discoverySpecPath)"
        $discoveryExists = $null -ne ($allEntries | Where-Object { $_ -ieq $resolvedDiscoveryPath })
        Assert-Condition $discoveryExists "manifest discoverySpecPath target '$resolvedDiscoveryPath' does not exist in the package."
    }

    # xsdDirectory: when non-null, must equal exactly "xsd" (the only value WriteManifest emits
    # and the only value the contract permits), and at least one .xsd file must exist under
    # that directory prefix. When null, no entry may exist under the xsd/ prefix — this closes
    # the false-green hole where xsd/evil.dll could slip in alongside a null xsdDirectory.
    if ($null -ne $manifest.xsdDirectory) {
        Assert-Condition ($manifest.xsdDirectory -eq 'xsd') "manifest xsdDirectory must equal exactly 'xsd' but is '$($manifest.xsdDirectory)'. Only the value 'xsd' is permitted by the package contract."
        $xsdPrefix  = "$apiSchemaBase/$($manifest.xsdDirectory)/"
        $xsdEntries = @($allEntries | Where-Object {
            $_.StartsWith($xsdPrefix, [System.StringComparison]::OrdinalIgnoreCase) -and
            (-not $_.EndsWith('/')) -and
            $_.EndsWith('.xsd', [System.StringComparison]::OrdinalIgnoreCase)
        })
        Assert-Condition ($xsdEntries.Count -gt 0) "manifest xsdDirectory '$($manifest.xsdDirectory)' is set but no .xsd files were found under prefix '$xsdPrefix'. A non-null xsdDirectory requires at least one .xsd file."
    } else {
        # xsdDirectory is null: assert no entry exists under the xsd/ prefix.
        $xsdNullPrefix  = "$apiSchemaBase/xsd/"
        $xsdNullEntries = @($allEntries | Where-Object { $_.StartsWith($xsdNullPrefix, [System.StringComparison]::OrdinalIgnoreCase) })
        Assert-Condition ($xsdNullEntries.Count -eq 0) "manifest xsdDirectory is null but entries were found under '$xsdNullPrefix': $($xsdNullEntries -join ', '). Either set xsdDirectory in the manifest or remove these entries from the package."
    }

    # ---- 8. discovery-spec core/extension contract (PACKAGE-CONTRACT.md lines 72, 97) ----
    # Core (isExtensionProject false): discovery-spec.json MUST be present.
    # Extension (isExtensionProject true): discovery-spec.json MUST NOT be present.
    $discoverySpecEntryPath = "$apiSchemaBase/discovery-spec.json"
    $discoverySpecEntryExists = $null -ne ($allEntries | Where-Object { $_ -ieq $discoverySpecEntryPath })
    if ($manifest.isExtensionProject -eq $false) {
        # Core package: discoverySpecPath must be non-null and the file must exist.
        Assert-Condition ($null -ne $manifest.discoverySpecPath) "Core package (isExtensionProject: false) must have a non-null 'discoverySpecPath' in the manifest, but it is null. Core packages require 'discovery-spec.json' (PACKAGE-CONTRACT.md)."
        Assert-Condition $discoverySpecEntryExists "Core package (isExtensionProject: false) must include '$discoverySpecEntryPath' in the package, but it was not found. Core packages require 'discovery-spec.json' (PACKAGE-CONTRACT.md)."
    } else {
        # Extension package: discoverySpecPath must be null and the file must not exist.
        Assert-Condition ($null -eq $manifest.discoverySpecPath) "Extension package (isExtensionProject: true) must have a null 'discoverySpecPath' in the manifest, but it is '$($manifest.discoverySpecPath)'. Extension packages must NOT include 'discovery-spec.json' (PACKAGE-CONTRACT.md)."
        Assert-Condition (-not $discoverySpecEntryExists) "Extension package (isExtensionProject: true) must NOT include '$discoverySpecEntryPath' in the package, but the entry was found. Extension packages must NOT include 'discovery-spec.json' (PACKAGE-CONTRACT.md)."
    }

    # ---- all checks passed ----
    Write-Host "Validation PASSED for package: $nupkgPath" -ForegroundColor Green

    } finally {
        # Dispose the archive handles regardless of how the try block exits
        # (normal return, Assert-Condition exit, or an unexpected throw).
        if ($null -ne $zipArchive) { $zipArchive.Dispose() }
        if ($null -ne $zipStream)  { $zipStream.Dispose() }
    }
}

<#
.SYNOPSIS
    Runs a full end-to-end packaging smoke verification for Core, Sample, and Homograph.

.DESCRIPTION
    Creates a synthetic MetaEdOutput directory under a temporary folder, then for each of the
    three representative project types (Core → EdFi, Sample with XSD, Homograph without XSD)
    runs the complete pipeline:

        StageAssets → WriteManifest → Package (dotnet pack) → Validate

    After Validate passes the function also asserts:
      - For Homograph: discoverySpecPath and xsdDirectory are null in the manifest.
      - Extension XSD file names carry NO extension-name prefix (e.g. no "Sample-" prefix).

    Synthetic MetaEdOutput layout created by this function:
      <tmp>/MetaEdOutput/EdFi/ApiSchema/ApiSchema.json          (Core)
      <tmp>/MetaEdOutput/EdFi/XSD/Ed-Fi-Core.xsd
      <tmp>/MetaEdOutput/EdFi/Interchange/Interchange-Student.xsd
      <tmp>/MetaEdOutput/Sample/ApiSchema/ApiSchema-EXTENSION.json
      <tmp>/MetaEdOutput/Sample/XSD/EXTENSION-Ed-Fi-Extended-Core.xsd
      <tmp>/MetaEdOutput/Sample/Interchange/Interchange-Sample.xsd
      <tmp>/MetaEdOutput/Homograph/ApiSchema/ApiSchema-EXTENSION.json

    All temporary artifacts (MetaEdOutput, staging/, generated .nupkg files for verify versions)
    are cleaned up after the run regardless of success or failure.

    Prints a clear "PASS: <project>" line for each project and exits non-zero on any failure.
#>

# ---- Negative-test helpers (used by Verify) ----
# These exercise the Validate gate adversarially: the gate's entire value is REJECTING bad packages,
# so these construct known-bad .nupkg files (by mutating a valid one in-memory) and assert Validate
# fails. A regression that widens the allow-list would otherwise pass CI silently.

# Adds or replaces a text entry inside an open (Update-mode) ZipArchive.
function Set-ZipEntryText {
    param([System.IO.Compression.ZipArchive] $Zip, [string] $EntryPath, [string] $Content)
    $existing = $Zip.GetEntry($EntryPath)
    if ($null -ne $existing) { $existing.Delete() }
    $entry  = $Zip.CreateEntry($EntryPath)
    $writer = [System.IO.StreamWriter]::new($entry.Open())
    try { $writer.Write($Content) } finally { $writer.Dispose() }
}

# Copies a valid .nupkg to a new path and applies a mutation scriptblock to the open archive.
function New-MutatedPackage {
    param([string] $BasePackage, [string] $DestPackage, [scriptblock] $Mutate)
    Copy-Item -Path $BasePackage -Destination $DestPackage -Force
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $stream = [System.IO.File]::Open($DestPackage, [System.IO.FileMode]::Open)
    $zip    = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Update)
    try { & $Mutate $zip } finally { $zip.Dispose(); $stream.Dispose() }
    return $DestPackage
}

# Runs Validate against a package in a child pwsh and asserts it is REJECTED (non-zero exit).
function Assert-ValidateRejects {
    param([string] $ScriptPath, [string] $PackageFile, [string] $ExtensionName, [string] $CaseName)
    & pwsh -NoProfile -Command "& '$ScriptPath' -Command Validate -ExtensionName '$ExtensionName' -PackageFile '$PackageFile'" *> $null
    if ($LASTEXITCODE -eq 0) {
        Write-Error "Verify NEGATIVE case FAILED: Validate ACCEPTED a bad package ('$CaseName'). The gate must reject it."
        exit 1
    }
    Write-Host "  rejected as expected: $CaseName" -ForegroundColor Green
}

function Verify {
    # Use a unique version suffix to avoid collisions with pre-existing .nupkg files.
    $verifyVersion = "0.0.0-verify"

    # ---- create synthetic MetaEdOutput under a temp directory ----
    $tmpRoot = Join-Path ([IO.Path]::GetTempPath()) "metaed-verify-$([System.Guid]::NewGuid().ToString('N'))"
    $metaEdOutputRoot = Join-Path $tmpRoot "MetaEdOutput"
    New-Item -ItemType Directory -Path $metaEdOutputRoot -Force | Out-Null
    Write-Host "Verify: synthetic MetaEdOutput at $metaEdOutputRoot"

    # Minimal valid projectSchema object shared across synthetic schemas.
    # Core is NOT an extension; Sample and Homograph ARE extensions.
    $coreSchema = [ordered]@{
        projectSchema = [ordered]@{
            projectName           = "Ed-Fi"
            projectEndpointName   = "ed-fi"
            isExtensionProject    = $false
        }
    } | ConvertTo-Json -Depth 5

    $sampleSchema = [ordered]@{
        projectSchema = [ordered]@{
            projectName           = "Sample"
            projectEndpointName   = "sample"
            isExtensionProject    = $true
        }
    } | ConvertTo-Json -Depth 5

    $homographSchema = [ordered]@{
        projectSchema = [ordered]@{
            projectName           = "Homograph"
            projectEndpointName   = "homograph"
            isExtensionProject    = $true
        }
    } | ConvertTo-Json -Depth 5

    # Minimal valid XSD content.
    $minimalXsd = '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"/>'

    # --- Core layout ---
    $coreApiSchemaDir  = Join-Path $metaEdOutputRoot "EdFi" "ApiSchema"
    $coreXsdDir        = Join-Path $metaEdOutputRoot "EdFi" "XSD"
    $coreInterchangeDir= Join-Path $metaEdOutputRoot "EdFi" "Interchange"
    New-Item -ItemType Directory -Path $coreApiSchemaDir   -Force | Out-Null
    New-Item -ItemType Directory -Path $coreXsdDir         -Force | Out-Null
    New-Item -ItemType Directory -Path $coreInterchangeDir -Force | Out-Null
    Set-Content -Path (Join-Path $coreApiSchemaDir   "ApiSchema.json")              -Value $coreSchema    -Encoding utf8
    Set-Content -Path (Join-Path $coreXsdDir         "Ed-Fi-Core.xsd")              -Value $minimalXsd    -Encoding utf8
    Set-Content -Path (Join-Path $coreInterchangeDir "Interchange-Student.xsd")     -Value $minimalXsd    -Encoding utf8

    # --- Sample layout (extension WITH XSD) ---
    $sampleApiSchemaDir  = Join-Path $metaEdOutputRoot "Sample" "ApiSchema"
    $sampleXsdDir        = Join-Path $metaEdOutputRoot "Sample" "XSD"
    $sampleInterchangeDir= Join-Path $metaEdOutputRoot "Sample" "Interchange"
    New-Item -ItemType Directory -Path $sampleApiSchemaDir   -Force | Out-Null
    New-Item -ItemType Directory -Path $sampleXsdDir         -Force | Out-Null
    New-Item -ItemType Directory -Path $sampleInterchangeDir -Force | Out-Null
    Set-Content -Path (Join-Path $sampleApiSchemaDir   "ApiSchema-EXTENSION.json")            -Value $sampleSchema  -Encoding utf8
    Set-Content -Path (Join-Path $sampleXsdDir         "EXTENSION-Ed-Fi-Extended-Core.xsd")   -Value $minimalXsd    -Encoding utf8
    Set-Content -Path (Join-Path $sampleInterchangeDir "Interchange-Sample.xsd")              -Value $minimalXsd    -Encoding utf8

    # --- Homograph layout (extension WITHOUT XSD/Interchange/discovery-spec) ---
    $homographApiSchemaDir = Join-Path $metaEdOutputRoot "Homograph" "ApiSchema"
    New-Item -ItemType Directory -Path $homographApiSchemaDir -Force | Out-Null
    Set-Content -Path (Join-Path $homographApiSchemaDir "ApiSchema-EXTENSION.json") -Value $homographSchema -Encoding utf8

    # ---- helper: run the full pipeline for one project ----
    # We temporarily override the script-level variables by re-invoking the script
    # in a child process so that $ExtensionName, $Version, etc. are correct per project.
    function Invoke-VerifyProject {
        param (
            [string] $ProjectExtensionName,
            [string] $DataStdVersion
        )

        $scriptPath = $PSScriptRoot + "/build.ps1"

        # StageAssets — run from $tmpRoot so relative MetaEdOutput/ paths resolve.
        # Pipe the child invocation to Out-Host so its output is shown on the console for
        # diagnostics but is NOT captured into this function's success (output) stream — the
        # only pipeline output of Invoke-VerifyProject must be the final `return $nupkgPath`,
        # otherwise the caller's `$pkg` (and the cleanup list) would be polluted with child text.
        Write-Host "  [StageAssets] $ProjectExtensionName"
        & pwsh -NoProfile -Command "
            Set-Location '$tmpRoot'
            & '$scriptPath' -Command StageAssets -ExtensionName '$ProjectExtensionName'
        " | Out-Host
        $code = $LASTEXITCODE
        if ($code -ne 0) {
            Write-Error "Verify FAILED at StageAssets for '$ProjectExtensionName'. Exit code: $code"
            exit 1
        }

        # WriteManifest — also from $tmpRoot (staging dir is relative to script root, not cwd,
        # but WriteManifest uses $solutionRoot which is $PSScriptRoot, so run from any dir).
        # DataStandardVersion must be set for BOTH core and extensions so the manifest packageId is
        # computed correctly (e.g. EdFi.DataStandard52.Sample.ApiSchema) — DMS-1155 D8.
        Write-Host "  [WriteManifest] $ProjectExtensionName"
        & pwsh -NoProfile -Command "
            `$env:DataStandardVersion = '$DataStdVersion'
            & '$scriptPath' -Command WriteManifest -ExtensionName '$ProjectExtensionName'
        " | Out-Host
        $code = $LASTEXITCODE
        if ($code -ne 0) {
            Write-Error "Verify FAILED at WriteManifest for '$ProjectExtensionName'. Exit code: $code"
            exit 1
        }

        # Package (dotnet pack) — pass DataStandardVersion (required for core and extensions, D8).
        Write-Host "  [Package] $ProjectExtensionName"
        & pwsh -NoProfile -Command "
            `$env:DataStandardVersion = '$DataStdVersion'
            & '$scriptPath' -Command Package -ExtensionName '$ProjectExtensionName' -Version '$verifyVersion'
        " | Out-Host
        $code = $LASTEXITCODE
        if ($code -ne 0) {
            Write-Error "Verify FAILED at Package for '$ProjectExtensionName'. Exit code: $code"
            exit 1
        }

        # Determine the produced .nupkg path. The PackageId includes DataStandardVersion for both
        # core and extensions (DMS-1155 D8); computed via the shared helper so it stays in lockstep.
        $nupkgName = "$(Get-ApiSchemaPackageId -ExtensionName $ProjectExtensionName -DataStandardVersion $DataStdVersion).$verifyVersion.nupkg"
        $nupkgPath = Join-Path $PSScriptRoot $nupkgName

        if (-not (Test-Path -Path $nupkgPath)) {
            Write-Error "Verify: expected .nupkg not found at '$nupkgPath' after dotnet pack."
            exit 1
        }

        # Validate — reuse the existing Validate command. -PackageFile is authoritative, so -Version
        # is not passed (it would be ignored when -PackageFile is present).
        Write-Host "  [Validate] $ProjectExtensionName"
        & pwsh -NoProfile -Command "
            & '$scriptPath' -Command Validate -ExtensionName '$ProjectExtensionName' -PackageFile '$nupkgPath'
        " | Out-Host
        $code = $LASTEXITCODE
        if ($code -ne 0) {
            Write-Error "Verify FAILED at Validate for '$ProjectExtensionName'. Exit code: $code"
            exit 1
        }

        # ---- extra per-project assertions ----

        # Read the manifest from inside the .nupkg to check null fields and no-prefix.
        # Wrap archive open + entry reads in try/finally so the handles are always disposed
        # even when the archive is corrupt/truncated or the manifest entry is missing.
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $zipStream  = $null
        $zipArchive = $null
        try {
            $zipStream  = [System.IO.File]::OpenRead($nupkgPath)
            $zipArchive = [System.IO.Compression.ZipArchive]::new($zipStream, [System.IO.Compression.ZipArchiveMode]::Read)
        } catch {
            if ($null -ne $zipArchive) { $zipArchive.Dispose() }
            if ($null -ne $zipStream)  { $zipStream.Dispose() }
            Write-Error "Verify: failed to open '$nupkgPath' as a ZIP archive (file may be corrupt or truncated): $_"
            exit 1
        }

        try {

        $allEntries = @($zipArchive.Entries | ForEach-Object { $_.FullName })

        # Read manifest JSON from the archive.
        # Guard $manifestEntry -ne $null before calling .Open() so a missing manifest entry
        # produces a clear error rather than a NullReferenceException (which would leave the
        # archive handle open on older PowerShell versions that do not honour finally on throw).
        $manifestEntry = $zipArchive.Entries | Where-Object { $_.FullName -ieq 'contentFiles/any/any/ApiSchema/package-manifest.json' } | Select-Object -First 1
        if ($null -eq $manifestEntry) {
            Write-Error "Verify: 'contentFiles/any/any/ApiSchema/package-manifest.json' not found inside '$nupkgPath'. The package may be malformed."
            exit 1
        }
        $manifestReader = [System.IO.StreamReader]::new($manifestEntry.Open())
        $manifestObj    = $manifestReader.ReadToEnd() | ConvertFrom-Json
        $manifestReader.Dispose()

        # Assertion helper.
        function Assert-Extra ([bool]$cond, [string]$msg) {
            if (-not $cond) {
                $zipArchive.Dispose()
                $zipStream.Dispose()
                Write-Error "Verify extra assertion FAILED for '$ProjectExtensionName': $msg"
                exit 1
            }
        }

        # Positive packageId assertion: confirm the manifest contains the expected NuGet package id.
        # This catches the class of bug fixed in Task 11 (unversioned core id) and any future
        # regression where the manifest packageId drifts from the real NuGet package identity.
        # Computed via the shared helper so core and extensions both carry the DataStandardVersion
        # (e.g. EdFi.DataStandard52.ApiSchema, EdFi.DataStandard52.Sample.ApiSchema) — DMS-1155 D8.
        $expectedPackageId = Get-ApiSchemaPackageId -ExtensionName $ProjectExtensionName -DataStandardVersion $DataStdVersion
        Assert-Extra ([string]::Compare($manifestObj.packageId, $expectedPackageId, [System.StringComparison]::OrdinalIgnoreCase) -eq 0) "manifest packageId must be '$expectedPackageId' but is '$($manifestObj.packageId)'."

        # Homograph: discoverySpecPath and xsdDirectory must be null.
        if ($ProjectExtensionName -eq 'Homograph') {
            Assert-Extra ($null -eq $manifestObj.discoverySpecPath) "discoverySpecPath must be null for Homograph but is '$($manifestObj.discoverySpecPath)'."
            Assert-Extra ($null -eq $manifestObj.xsdDirectory)      "xsdDirectory must be null for Homograph but is '$($manifestObj.xsdDirectory)'."
        }

        # Core: discoverySpecPath must be non-null (discovery-spec.json checked in to eng/ApiSchema/).
        # xsdDirectory is NOT asserted here: per PACKAGE-CONTRACT.md and StageAssets, xsdDirectory
        # is optional and is null when a project produces no XSD. The synthetic Core fixture happens
        # to include XSD files, but that is incidental — "Core always has XSD" is not a contract
        # invariant, so asserting it non-null would encode a fixture accident as a requirement.
        if ($ProjectExtensionName -eq 'Core') {
            Assert-Extra ($null -ne $manifestObj.discoverySpecPath) "discoverySpecPath must be non-null for Core."
        }

        # Sample: xsdDirectory must be non-null; discoverySpecPath must be null (extension).
        if ($ProjectExtensionName -eq 'Sample') {
            Assert-Extra ($null -ne $manifestObj.xsdDirectory)      "xsdDirectory must be non-null for Sample (has XSD)."
            Assert-Extra ($null -eq $manifestObj.discoverySpecPath) "discoverySpecPath must be null for Sample (extension)."
        }

        # Extension XSD names must NOT carry the extension name as a prefix.
        # For Sample the staged XSD files should be e.g. "EXTENSION-Ed-Fi-Extended-Core.xsd",
        # NOT "Sample-EXTENSION-Ed-Fi-Extended-Core.xsd".
        if ($ProjectExtensionName -ne 'Core') {
            $prefix = "$ProjectExtensionName-"
            $xsdBase = 'contentFiles/any/any/ApiSchema/xsd/'
            $badEntries = @($allEntries | Where-Object {
                $_.StartsWith($xsdBase, [System.StringComparison]::OrdinalIgnoreCase) -and
                (Split-Path $_ -Leaf).StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)
            })
            Assert-Extra ($badEntries.Count -eq 0) "XSD files must NOT carry a '$prefix' prefix but found: $($badEntries -join ', ')."
        }

        } finally {
            # Dispose the archive handles regardless of how the try block exits
            # (normal return, Assert-Extra exit, or an unexpected throw).
            if ($null -ne $zipArchive) { $zipArchive.Dispose() }
            if ($null -ne $zipStream)  { $zipStream.Dispose() }
        }

        return $nupkgPath
    }

    # ---- track generated .nupkg paths for cleanup ----
    $generatedNupkgs = @()

    try {
        # Run Core (DataStandardVersion="52" for local verify; mirrors the "DS-5.2.0" short-version).
        Write-Host "`nVerify: running pipeline for Core ..."
        $pkg = Invoke-VerifyProject -ProjectExtensionName "Core" -DataStdVersion "52"
        $generatedNupkgs += $pkg
        Write-Host "PASS: Core" -ForegroundColor Green

        # Run Sample (extension WITH XSD). DataStandardVersion is now REQUIRED for extensions too,
        # because the extension csproj PackageId interpolates $(DataStandardVersion) (DMS-1155 D8) —
        # e.g. EdFi.DataStandard52.Sample.ApiSchema. "52" mirrors the "DS-5.2.0" short-version.
        Write-Host "`nVerify: running pipeline for Sample ..."
        $pkg = Invoke-VerifyProject -ProjectExtensionName "Sample" -DataStdVersion "52"
        $generatedNupkgs += $pkg
        $samplePkg = $pkg   # reused as the valid base for the negative cases below
        Write-Host "PASS: Sample" -ForegroundColor Green

        # Run Homograph (extension WITHOUT XSD/Interchange/discovery-spec). DataStandardVersion is
        # required for extensions (see Sample comment above).
        Write-Host "`nVerify: running pipeline for Homograph ..."
        $pkg = Invoke-VerifyProject -ProjectExtensionName "Homograph" -DataStdVersion "52"
        $generatedNupkgs += $pkg
        Write-Host "PASS: Homograph" -ForegroundColor Green

        Write-Host "`nVerify: ALL PROJECTS PASSED." -ForegroundColor Green

        # ---- NEGATIVE cases: the Validate gate MUST reject malformed/tampered packages ----
        # These mutate the valid Sample .nupkg ($samplePkg) in-memory and assert Validate fails,
        # plus one StageAssets duplicate-name case. They turn the previously-manual adversarial
        # checks into a checked-in regression guard for the publish gate.
        Write-Host "`nVerify: running NEGATIVE cases (gate must REJECT each) ..."
        $scriptPath = Join-Path $PSScriptRoot "build.ps1"
        $negDir = Join-Path $tmpRoot "neg"
        New-Item -ItemType Directory -Path $negDir -Force | Out-Null

        # 1. Planted top-level assembly (fails the positive allow-list).
        $p = New-MutatedPackage -BasePackage $samplePkg -DestPackage (Join-Path $negDir 'case-dll.nupkg') -Mutate {
            param($zip) Set-ZipEntryText -Zip $zip -EntryPath 'evil.dll' -Content 'x'
        }
        Assert-ValidateRejects -ScriptPath $scriptPath -PackageFile $p -ExtensionName 'Sample' -CaseName 'planted top-level evil.dll'

        # 2. Planted forbidden directory segment (lib/) — caught by the segment denylist.
        $p = New-MutatedPackage -BasePackage $samplePkg -DestPackage (Join-Path $negDir 'case-lib.nupkg') -Mutate {
            param($zip) Set-ZipEntryText -Zip $zip -EntryPath 'lib/net10.0/x.txt' -Content 'x'
        }
        Assert-ValidateRejects -ScriptPath $scriptPath -PackageFile $p -ExtensionName 'Sample' -CaseName 'planted lib/ directory segment'

        # 3. Non-.xsd file under the xsd/ payload directory.
        $p = New-MutatedPackage -BasePackage $samplePkg -DestPackage (Join-Path $negDir 'case-xsd-dll.nupkg') -Mutate {
            param($zip) Set-ZipEntryText -Zip $zip -EntryPath 'contentFiles/any/any/ApiSchema/xsd/evil.dll' -Content 'x'
        }
        Assert-ValidateRejects -ScriptPath $scriptPath -PackageFile $p -ExtensionName 'Sample' -CaseName 'non-.xsd file under xsd/'

        # 4. Manifest packageId tampered so it no longer matches the nuspec <id> (check 7).
        $p = New-MutatedPackage -BasePackage $samplePkg -DestPackage (Join-Path $negDir 'case-badid.nupkg') -Mutate {
            param($zip)
            $manifestPath = 'contentFiles/any/any/ApiSchema/package-manifest.json'
            $entry  = $zip.GetEntry($manifestPath)
            $reader = [System.IO.StreamReader]::new($entry.Open())
            try { $json = $reader.ReadToEnd() } finally { $reader.Dispose() }
            $obj = $json | ConvertFrom-Json
            $obj.packageId = 'EdFi.DataStandard52.WrongId.ApiSchema'
            Set-ZipEntryText -Zip $zip -EntryPath $manifestPath -Content ($obj | ConvertTo-Json -Depth 5)
        }
        Assert-ValidateRejects -ScriptPath $scriptPath -PackageFile $p -ExtensionName 'Sample' -CaseName 'manifest packageId != nuspec <id>'

        # 5. Extension package carrying a discovery-spec.json (forbidden for extensions, check 8).
        $p = New-MutatedPackage -BasePackage $samplePkg -DestPackage (Join-Path $negDir 'case-extdisc.nupkg') -Mutate {
            param($zip) Set-ZipEntryText -Zip $zip -EntryPath 'contentFiles/any/any/ApiSchema/discovery-spec.json' -Content '{}'
        }
        Assert-ValidateRejects -ScriptPath $scriptPath -PackageFile $p -ExtensionName 'Sample' -CaseName 'extension carrying discovery-spec.json'

        # 6. StageAssets must reject an XSD/ + Interchange/ file-name collision (before pack).
        $dupProj   = 'DupCollide'
        $dupApiDir = Join-Path $metaEdOutputRoot $dupProj "ApiSchema"
        $dupXsdDir = Join-Path $metaEdOutputRoot $dupProj "XSD"
        $dupIntDir = Join-Path $metaEdOutputRoot $dupProj "Interchange"
        New-Item -ItemType Directory -Path $dupApiDir, $dupXsdDir, $dupIntDir -Force | Out-Null
        Set-Content -Path (Join-Path $dupApiDir "ApiSchema-EXTENSION.json") -Value $sampleSchema -Encoding utf8
        Set-Content -Path (Join-Path $dupXsdDir "Collide.xsd") -Value $minimalXsd -Encoding utf8
        Set-Content -Path (Join-Path $dupIntDir "Collide.xsd") -Value $minimalXsd -Encoding utf8
        & pwsh -NoProfile -Command "Set-Location '$tmpRoot'; & '$scriptPath' -Command StageAssets -ExtensionName '$dupProj'" *> $null
        if ($LASTEXITCODE -eq 0) {
            Write-Error "Verify NEGATIVE case FAILED: StageAssets ACCEPTED a duplicate XSD/Interchange file name. It must reject it."
            exit 1
        }
        Write-Host "  rejected as expected: StageAssets duplicate XSD/Interchange name" -ForegroundColor Green

        Write-Host "`nVerify: ALL NEGATIVE CASES correctly rejected." -ForegroundColor Green
    }
    finally {
        # ---- clean up synthetic MetaEdOutput and staging directories ----
        Write-Host "`nVerify: cleaning up temporary artifacts ..."

        # Remove temp MetaEdOutput root.
        if (Test-Path -Path $tmpRoot) {
            Remove-Item -Path $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  Removed: $tmpRoot"
        }

        # Remove staging directories created for the verify run.
        foreach ($ext in @("Core", "Sample", "Homograph", "DupCollide")) {
            $stagingDir = Join-Path $PSScriptRoot "staging" $ext
            if (Test-Path -Path $stagingDir) {
                Remove-Item -Path $stagingDir -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "  Removed staging: $stagingDir"
            }
        }
        # Remove the staging parent if now empty.
        $stagingParent = Join-Path $PSScriptRoot "staging"
        if ((Test-Path -Path $stagingParent) -and ((Get-ChildItem -Path $stagingParent -Force | Measure-Object).Count -eq 0)) {
            Remove-Item -Path $stagingParent -Force -ErrorAction SilentlyContinue
            Write-Host "  Removed staging parent: $stagingParent"
        }

        # Remove generated .nupkg files created by the verify run.
        foreach ($nupkg in $generatedNupkgs) {
            if (Test-Path -Path $nupkg) {
                Remove-Item -Path $nupkg -Force -ErrorAction SilentlyContinue
                Write-Host "  Removed nupkg: $nupkg"
            }
        }

        # Remove bin/ and obj/ directories created by dotnet pack.
        foreach ($dir in @("bin", "obj")) {
            $dirPath = Join-Path $PSScriptRoot $dir
            if (Test-Path -Path $dirPath) {
                Remove-Item -Path $dirPath -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "  Removed: $dirPath"
            }
        }
    }
}

switch ($Command) {
    InstallCredentialHandler { InstallCredentialHandler }
    Package { BuildPackage }
    PushPackage {
        PushPackage -EdFiNuGetFeed $EdFiNuGetFeed -NuGetApiKey $NuGetApiKey -PackageFile $PackageFile -DryRun:$DryRun
    }
    RunMetaEd { RunMetaEd }
    StageAssets { StageAssets }
    WriteManifest { WriteManifest }
    Validate { Validate }
    Verify { Verify }
    default { throw "Command '$Command' is not recognized" }
}
