# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

param (
    [string]$Workspace,
    [string]$ProjectVersion,
    [string]$ProjectDescription,
    [string]$TechnologyVersion,
    [string]$MetaEdExtensionName = ""   
)

# Extracts metaEdProject.projectVersion from MetaEd project package.json
function Get-ProjectVersionFromPackageJson {
    param (
        [string]$PackageJsonPath
    )

    if (-not (Test-Path $PackageJsonPath -PathType Leaf)) {
        Write-Warning "MetaEd project package.json not found at $PackageJsonPath"
        return $null
    }

    try {
        $jsonContent = Get-Content -Path $PackageJsonPath -Raw
        $jsonObject = $jsonContent | ConvertFrom-Json -ErrorAction Stop

        if ($jsonObject.PSObject.Properties.Name -contains 'metaEdProject' -and $null -ne $jsonObject.metaEdProject) {
            if ($jsonObject.metaEdProject.PSObject.Properties.Name -contains 'projectVersion' -and -not [string]::IsNullOrEmpty($jsonObject.metaEdProject.projectVersion)) {
                return $jsonObject.metaEdProject.projectVersion
            } else {
                Write-Warning "JSON element 'metaEdProject.projectVersion' not found in $PackageJsonPath"
                return $null
            }
        } else {
            Write-Warning "JSON element 'metaEdProject' not found in $PackageJsonPath"
            return $null
        }
    }
    catch {
        Write-Warning "Error reading package.json at '$PackageJsonPath': $($_.Exception.Message)"
        return $null
    }
}

# Define the base structure for MetaEd configuration
$metaEdConfig = @{
    "metaEdConfiguration" = @{
        "artifactDirectory"    = "$Workspace/MetaEd-js/MetaEdOutput"
        "deployDirectory"      = ""
        "pluginTechVersion"    = @{}
        "projects" = @(
            @{
                "namespaceName" = "EdFi"
                "projectName"   = "Ed-Fi"
                "projectVersion" = $ProjectVersion
                "projectExtension" = ""
                "description"    = "$ProjectDescription"
            }
        )
        "projectPaths" = @(
            "$Workspace/MetaEd-js/node_modules/@edfi/ed-fi-model-5.2"
        )
        "pluginConfigDirectories" = @()
        "defaultPluginTechVersion" = $TechnologyVersion
        "allianceMode" = $true
        "suppressPrereleaseVersion" = $true
    }
}

if ($MetaEdExtensionName -eq "TPDM" -or $MetaEdExtensionName -eq "Homograph" -or $MetaEdExtensionName -eq "Sample") {
    $extensionProjectVersionDefault = "1.0.0"
    $extensionProjectPath = "$Workspace/MetaEdExtensionSource"
    $packageJsonPathForExtension = Join-Path -Path $extensionProjectPath -ChildPath "package.json"
    
    $extractedVersion = Get-ProjectVersionFromPackageJson -PackageJsonPath $packageJsonPathForExtension
    
    $versionToUse = $extensionProjectVersionDefault
    if (-not [string]::IsNullOrEmpty($extractedVersion)) {
        $versionToUse = $extractedVersion
        Write-Host "Using projectVersion '$versionToUse' from $packageJsonPathForExtension for $MetaEdExtensionName extension."
    } else {
        Write-Warning "Could not extract projectVersion from $packageJsonPathForExtension for $MetaEdExtensionName extension. Defaulting to '$versionToUse'."
    }

    $metaEdConfig.metaEdConfiguration.projects += @{
        "namespaceName" = "$MetaEdExtensionName"
        "projectName"   = "$MetaEdExtensionName"
        "projectVersion" = $versionToUse
        "projectExtension" = "EXTENSION"
        "description"    = ""
    }

    $metaEdConfig.metaEdConfiguration.projectPaths += $extensionProjectPath
}

# Define the file path for the new configuration file
$FilePath = "$Workspace/MetaEd-js/eng/ApiSchema/MetaEdConfig-$TechnologyVersion-DS-5.2-$MetaEdExtensionName.json"

# Save the JSON to a file
$metaEdConfig | ConvertTo-Json -Depth 100 | Out-File -FilePath $FilePath -NoNewline -Encoding Ascii
Write-Host "MetaEd configuration file created at: $FilePath"
