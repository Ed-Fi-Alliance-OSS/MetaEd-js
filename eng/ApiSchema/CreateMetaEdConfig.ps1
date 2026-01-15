# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

param (
    [string]$Workspace,
    [string]$TechnologyVersion,
    [string]$ProjectVersion,
    [string]$ProjectDescription,
    [string]$CoreProjectPath,
    [string]$ExtensionProjectPath = "",
    [string]$ExtensionProjectName = ""   
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

if(($ExtensionProjectPath -ne "" -or $ExtensionProjectName -ne "") -and ($ExtensionProjectPath -eq "" -or $ExtensionProjectName -eq "")) {
    throw "Both ExtensionProjectPath and ExtensionProjectName must be provided if one is specified."
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
            "$Workspace/$CoreProjectPath"
        )
        "pluginConfigDirectories" = @()
        "defaultPluginTechVersion" = $TechnologyVersion
        "allianceMode" = $true
        "suppressPrereleaseVersion" = $true
    }
}

if ($ExtensionProjectName -and $ExtensionProjectName -ne "Core") {
    $extensionProjectVersionDefault = "1.0.0"
    $extensionProjectPath = "$Workspace/$ExtensionProjectPath"
    $packageJsonPathForExtension = Join-Path -Path $extensionProjectPath -ChildPath "package.json"
    
    $extractedVersion = Get-ProjectVersionFromPackageJson -PackageJsonPath $packageJsonPathForExtension
    
    $versionToUse = $extensionProjectVersionDefault
    if($ExtensionProjectName -eq "TPDM") {
        $versionToUse = "1.1.0"
    }
    if (-not [string]::IsNullOrEmpty($extractedVersion)) {
        $versionToUse = $extractedVersion
        Write-Host "Using projectVersion '$versionToUse' from $packageJsonPathForExtension for $ExtensionProjectName extension."
    } else {
        Write-Warning "Could not extract projectVersion from $packageJsonPathForExtension for $ExtensionProjectName extension. Defaulting to '$versionToUse'."
    }

    $metaEdConfig.metaEdConfiguration.projects += @{
        "namespaceName" = "$ExtensionProjectName"
        "projectName"   = "$ExtensionProjectName"
        "projectVersion" = $versionToUse
        "projectExtension" = "EXTENSION"
        "description"    = ""
    }

    $metaEdConfig.metaEdConfiguration.projectPaths += $extensionProjectPath
}

# Define the file path for the new configuration file
$FilePath = "$Workspace/MetaEd-js/eng/ApiSchema/MetaEdConfig.json"

# Save the JSON to a file
$metaEdConfig | ConvertTo-Json -Depth 100 | Out-File -FilePath $FilePath -NoNewline -Encoding Ascii
Write-Host "MetaEd configuration file created at: $FilePath"
