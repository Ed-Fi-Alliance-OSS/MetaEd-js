[CmdLetBinding()]
param (
    [string]
    [ValidateSet("DotNetClean", "Build", "BuildAndPublish", "PushPackage", "Unzip", "Package", "RunMetaEd", "MoveMetaEdSchema")]
    $Command = "Build",

    [String]
    $Version="1.0.0",

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
    $schemaPackagingConfigFile = "/home/runner/work/MetaEd-js/MetaEd-js/eng/ApiSchema/ApiSchemaPackaging-GitHub.json"
)

$solutionRoot = "$PSScriptRoot"
$defaultSolution = "$solutionRoot/EdFi.DataStandard51.ApiSchema.sln"
$applicationRoot = "$solutionRoot/"
$projectName = "EdFi.DataStandard51.ApiSchema"

function Restore {
    dotnet restore $defaultSolution
}

function DotNetClean {
    dotnet clean $defaultSolution -c $Configuration --nologo -v minimal
}

function Compile {
    dotnet build $defaultSolution -c $Configuration -p:Version=$Version --nologo --no-restore
}

function PublishApi {
    $project = $applicationRoot
    $outputPath = "$project/publish"
    dotnet publish $project -c $Configuration -o $outputPath --nologo
}

function Invoke-UnzipFile {
    Invoke-WebRequest "https://odsassets.blob.core.windows.net/public/project-tanager/5.1.0-xsd-and-metadata.zip" `
        -OutFile json-and-xsd-$Version.zip
    Expand-Archive json-and-xsd-$Version.zip
    Move-Item -Path ./json-and-xsd-$Version/* -Destination $solutionRoot
    Remove-Item -Path ./json-and-xsd-$Version/
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
    $projectPath = "$applicationRoot/$projectName.csproj"
    dotnet pack $projectPath -c release -p:PackageVersion=$Version --output $PSScriptRoot
}

function RunMetaEd {
    # Run MetadEd Project
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
    node ./dist/index.js -a -c $schemaPackagingConfigFile
}

function CopyMetaEdFiles {
    # Copy the MetaEd Files into the ApiSchema Folder
    Copy-Item -Path ./MetaEdOutput/ApiSchema/ApiSchema/ApiSchema.json -Destination $solutionRoot

    Copy-Item -Path ./MetaEdOutput/EdFi/XSD/* -Destination $solutionRoot/xsd/
}

switch ($Command) {
    DotNetClean { DotNetClean }
    Build { Invoke-Build }
    Unzip { Invoke-UnzipFile }
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
