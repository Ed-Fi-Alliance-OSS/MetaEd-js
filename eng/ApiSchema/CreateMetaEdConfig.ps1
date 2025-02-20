param (
    [string]$Workspace,
    [string]$ProjectVersion,
    [string]$ProjectDescription,
    [string]$TechnologyVersion,
    [string]$MetaEdExtensionName = ""   
)

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
            "$Workspace/MetaEd-js/node_modules/@edfi/ed-fi-model-5.1"
        )
        "pluginConfigDirectories" = @()
        "defaultPluginTechVersion" = $TechnologyVersion
        "allianceMode" = $true
        "suppressPrereleaseVersion" = $true
    }
}

# Check if MetaEdExtensionName is provided and modify the configuration for TPDM
if ($MetaEdExtensionName -eq "TPDM") {
    $metaEdConfig.metaEdConfiguration.projects += @{
        "namespaceName" = "$MetaEdExtensionName"
        "projectName"   = "$MetaEdExtensionName"
        "projectVersion" = "1.0.0"
        "projectExtension" = "EXTENSION"
        "description"    = ""
    }

    $metaEdConfig.metaEdConfiguration.projectPaths += "$Workspace/MetaEdExtensionSource"
}

# Define the file path for the new configuration file
$FilePath = "$Workspace/MetaEd-js/eng/ApiSchema/MetaEdConfig-$TechnologyVersion-DS-5.1-$MetaEdExtensionName.json"

# Save the JSON to a file
$metaEdConfig | ConvertTo-Json -Depth 100 | Out-File -FilePath $FilePath -NoNewline -Encoding Ascii
Write-Host "MetaEd configuration file created at: $FilePath"
