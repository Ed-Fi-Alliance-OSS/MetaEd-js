[CmdLetBinding()]
param (
    [string]
    [ValidateSet("Clean", "Build", "BuildAndPublish", "PushPackage", "Unzip", "Package", "RunMetaEd", "MoveMetaEdSchema")]
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
    $NuGetApiKey,

    # Full path of a package file to push to the NuGet feed. Optional, only
    # applies with the Push command. If not set, then the script looks for a
    # NuGet package corresponding to the provided $DMSVersion and $BuildCounter.
    [string]
    $PackageFile,

    [switch]
    $DryRun
)

$solutionRoot = "$PSScriptRoot"
$defaultSolution = "$solutionRoot/EdFi.DataStandard51.ApiSchema.sln"
$applicationRoot = "$solutionRoot/"
$projectName = "EdFi.DataStandard51.ApiSchema"
Import-Module -Name "$PSScriptRoot/../../eng/build-helpers.psm1" -Force

function Restore {
    Invoke-Execute { dotnet restore $defaultSolution }
}

function DotNetClean {
    Invoke-Execute { dotnet clean $defaultSolution -c $Configuration --nologo -v minimal }
}

function Invoke-Clean {
    Invoke-Step { DotNetClean }
}

function Compile {
    Invoke-Execute {
        dotnet build $defaultSolution -c $Configuration -p:Version=$Version --nologo --no-restore
    }
}

function PublishApi {
    Invoke-Execute {
        $project = "$applicationRoot"
        $outputPath = "$project/publish"
        dotnet publish $project -c $Configuration -o $outputPath --nologo
    }
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

    Invoke-Execute {
        if (-not $NuGetApiKey) {
            throw "Cannot push a NuGet package without providing an API key in the `NuGetApiKey` argument."
        }

        if (-not $EdFiNuGetFeed) {
            throw "Cannot push a NuGet package without providing a feed in the `EdFiNuGetFeed` argument."
        }

        if (-not $PackageFile) {
            $PackageFile = "$PSScriptRoot/$projectName.$Version.nupkg"
        }

        if ($DryRun) {
            Write-Info "Dry run enabled, not pushing package."
        }
        else {
            Write-Info ("Pushing $PackageFile to $EdFiNuGetFeed")
            dotnet nuget push $PackageFile --source $EdFiNuGetFeed --api-key $NuGetApiKey
        }
    }
}

function Invoke-PushPackage {
    Invoke-Step { 
        PushPackage -EdFiNuGetFeed $EdFiNuGetFeed -NuGetApiKey $NuGetApiKey -PackageFile $PackageFile -DryRun:$DryRun
    } -Arguments @{
        EdFiNuGetFeed = $EdFiNuGetFeed;
        NuGetApiKey = $NuGetApiKey;
        PackageFile = $PackageFile;
        DryRun = $DryRun;
    }
}

function Invoke-Build {
    Invoke-Step { DotNetClean }
    Invoke-Step { Restore }
    Invoke-Step { Compile }
}

function Invoke-BuildPackage {
    Invoke-Step { BuildPackage }
}

function RunNuGetPack {
    param (
        [string]
        $ProjectPath,

        [string]
        $PackageVersion
    )

    dotnet pack $ProjectPath -c release -p:PackageVersion=$Version --output $PSScriptRoot
}

function BuildPackage {
    Write-Output "Building Package ($Version)"
    $mainPath = "$applicationRoot"
    $projectPath = "$mainPath/$projectName.csproj"

    RunNuGetPack -ProjectPath $projectPath -PackageVersion $Version
}

function Invoke-Publish {
    Write-Output "Building Version ($Version)"
    Invoke-Step { PublishApi }
}

function RunMetaEd {
    Write-Output "Run MetadEd Project"
    Invoke-Execute { npm install }
    Invoke-Execute { npm run build }
    Set-Location -Path ./packages/metaed-console

    Write-Output "Get Working Dir"
    Get-Location
    Get-ChildItem
    
    <#
    After building the project from the parent directory, we need to confirm it's functional using the following command,
    which will use the provided config file. For more details, 
    please refer to the readme file located in ./packages/meteaed-console/src/README.md
    #>     
    Invoke-Execute { node ./dist/index.js -a `
        -c /home/runner/work/MetaEd-js/MetaEd-js/eng/ApiSchema/ApiSchemaPackaging-GitHub.json }
}

function CopyMetaEdFiles {
    Write-Output "Copy the MetaEd Files into the ApiSchema Folder"

    Write-Output ("Copy the ApiSchema.json into the " + $solutionRoot)
    Copy-Item -Path ./MetaEdOutput/ApiSchema/ApiSchema/ApiSchema.json -Destination $solutionRoot
    
    Write-Output ("Copy the XSD content into the " + $solutionRoot + "/xsd")
    Copy-Item -Path ./MetaEdOutput/EdFi/XSD/* -Destination $solutionRoot/xsd/
}

function Invoke-RunMetaEd {
    Invoke-Step { RunMetaEd }
}

function Invoke-CopyMetaEd {
    Invoke-Step { CopyMetaEdFiles }
}

Invoke-Main {
    switch ($Command) {
        Clean { Invoke-Clean }
        Build { Invoke-Build }
        Unzip { Invoke-UnzipFile }
        BuildAndPublish { 
            Invoke-Build             
            Invoke-Publish
        }        
        Package { Invoke-BuildPackage }
        PushPackage { Invoke-PushPackage }
        RunMetaEd { Invoke-RunMetaEd }
        MoveMetaEdSchema { Invoke-CopyMetaEd }
        default { throw "Command '$Command' is not recognized" }
    }
}
