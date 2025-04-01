# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

[CmdLetBinding()]
param (
    [string]
    [ValidateSet("DotNetClean", "Build", "BuildAndPublish", "PushPackage", "Unzip", "Package", "RunMetaEd", "MoveMetaEdSchema")]
    $Command = "Build",

    [string]
    $Version = "1.0.0",

    [ValidateSet("Debug", "Release")]
    $Configuration = "Debug",

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
    $ApiSchemaPackageType = ""
)

$solutionRoot = "$PSScriptRoot"
$applicationRoot = "$solutionRoot/"
if($ApiSchemaPackageType -eq 'Core'){
    $projectName = "EdFi.DataStandard52.ApiSchema"
}
else {
    $projectName = "EdFi.$ApiSchemaPackageType.ApiSchema"
}

$projectPath = "$applicationRoot/$projectName.csproj"

function Restore {
    dotnet restore $projectPath
}

function DotNetClean {
    dotnet clean $projectPath  -c $Configuration --nologo -v minimal
}

function Compile {
    dotnet build $projectPath -c $Configuration -p:Version=$Version --nologo --no-restore
}

function PublishApi {
    $project = $applicationRoot
    $outputPath = "$project/publish"
    dotnet publish $projectPath -c $Configuration -o $outputPath --nologo
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
        Write-Output "Not Package File specified."
        $PackageFile = "$PSScriptRoot/$projectName.$Version.nupkg"
        Write-Output "Package File: $PackageFile"
    }

    if ($DryRun) {
        Write-Output "Dry run enabled, not pushing package."
    }
    else {
        Write-Output "Pushing the NuGet Package $PackageFile to $EdFiNuGetFeed"
        dotnet nuget push $PackageFile --source $EdFiNuGetFeed --api-key $NuGetApiKey
    }
}

function Invoke-Build {
    DotNetClean
    Restore
    Compile
}

function BuildPackage {
    $arguments = @("-c", "release", "-p:PackageVersion=$Version", "-p:PackageId=$projectName", "--output", $PSScriptRoot)
    dotnet pack $projectPath @arguments
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

    <#
    After building the project from the parent directory, we need to confirm
    it's functional using the following command, which will use the provided
    config file. For more details, please refer to the readme file located in
    ./packages/meteaed-console/src/README.md
    #>
    node ./dist/index.js -a -c $SchemaPackagingConfigFile
}

function CopyMetaEdFiles {
    # Copy the MetaEd Files into the ApiSchema Folder
    
    $destinationPath = "$solutionRoot/xsd/"
    if (!(Test-Path -Path $destinationPath)) {
        New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
    }

    if($ApiSchemaPackageType -eq 'Core'){
        Copy-Item -Path ./MetaEdOutput/EdFi/ApiSchema/ApiSchema.json -Destination $solutionRoot
        Copy-Item -Path ./MetaEdOutput/EdFi/XSD/* -Destination $solutionRoot/xsd/
        Copy-Item -Path ./MetaEdOutput/EdFi/Interchange/* -Destination $solutionRoot/xsd/
    }
    if($ApiSchemaPackageType -eq 'TPDM'){
        Copy-Item -Path ./MetaEdOutput/TPDM/ApiSchema/ApiSchema-EXTENSION.json -Destination "$solutionRoot/ApiSchema-$ApiSchemaPackageType-EXTENSION.json"
        Copy-Item -Path ./MetaEdOutput/TPDM/XSD/EXTENSION-Ed-Fi-Extended-Core.xsd -Destination "$solutionRoot/xsd/$ApiSchemaPackageType-EXTENSION-Ed-Fi-Extended-Core.xsd"
        Get-ChildItem -Path ./MetaEdOutput/TPDM/Interchange/ -File | ForEach-Object {
            $newFileName = "$ApiSchemaPackageType-$($_.Name)"
            $destinationFile = Join-Path -Path "$solutionRoot/xsd" -ChildPath $newFileName
            Copy-Item -Path $_.FullName -Destination $destinationFile
        }
    }
    if($ApiSchemaPackageType -eq 'Homograph'){
        Copy-Item -Path ./MetaEdOutput/Homograph/ApiSchema/ApiSchema-EXTENSION.json -Destination "$solutionRoot/ApiSchema-$ApiSchemaPackageType-EXTENSION.json"
    }
    if($ApiSchemaPackageType -eq 'Sample'){
        Copy-Item -Path ./MetaEdOutput/Sample/ApiSchema/ApiSchema-EXTENSION.json -Destination "$solutionRoot/ApiSchema-$ApiSchemaPackageType-EXTENSION.json"
        Copy-Item -Path ./MetaEdOutput/Sample/XSD/EXTENSION-Ed-Fi-Extended-Core.xsd -Destination "$solutionRoot/xsd/$ApiSchemaPackageType-EXTENSION-Ed-Fi-Extended-Core.xsd"
        Get-ChildItem -Path ./MetaEdOutput/Sample/Interchange/ -File | ForEach-Object {
            $newFileName = "$ApiSchemaPackageType-$($_.Name)"
            $destinationFile = Join-Path -Path "$solutionRoot/xsd" -ChildPath $newFileName
            Copy-Item -Path $_.FullName -Destination $destinationFile
        }
    }

    Get-ChildItem -Path "$solutionRoot" -Recurse -Include "*.json", "xsd\*.xsd" | Select-Object FullName
    Get-ChildItem -Path "$solutionRoot" -Recurse -Include "*.xsd" | Select-Object FullName
    Get-ChildItem -Path "$solutionRoot/xsd/" -Recurse -Include "*.xsd" | Select-Object FullName
}
switch ($Command) {
    DotNetClean { DotNetClean }
    Build { Invoke-Build }
    BuildAndPublish {
        Invoke-Build
        PublishApi
    }
    Package { BuildPackage }
    PushPackage { 
        PushPackage -EdFiNuGetFeed $EdFiNuGetFeed -NuGetApiKey $NuGetApiKey -PackageFile $PackageFile -DryRun:$DryRun
    }
    RunMetaEd { RunMetaEd }
    MoveMetaEdSchema { CopyMetaEdFiles }
    default { throw "Command '$Command' is not recognized" }
}
