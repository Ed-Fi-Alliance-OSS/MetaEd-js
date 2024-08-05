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

function Restore {
    $dotnetCommand = "dotnet restore $defaultSolution"
    Invoke-Expression $dotnetCommand
}

function DotNetClean {
    $dotnetCommand = "dotnet clean $defaultSolution -c $Configuration --nologo -v minimal"
    Invoke-Expression $dotnetCommand
}

function Invoke-Clean {
    DotNetClean
}

function Compile {
    $dotnetCommand = "dotnet build $defaultSolution -c $Configuration -p:Version=$Version --nologo --no-restore"
    Invoke-Expression $dotnetCommand
}

function PublishApi {
    $project = "$applicationRoot"
    $outputPath = "$project/publish"
    $dotnetCommand = "dotnet publish $project -c $Configuration -o $outputPath --nologo"
    Invoke-Expression $dotnetCommand
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

    Invoke-Expression {
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
            #Write-Host "Dry run enabled, not pushing package."
            #TODO Add output here
        }
        else {
            #Write-Host ("Pushing $PackageFile to $EdFiNuGetFeed")
            dotnet nuget push $PackageFile --source $EdFiNuGetFeed --api-key $NuGetApiKey
        }
    }
}

function Invoke-PushPackage {
    #Invoke-Step { 
#        PushPackage -EdFiNuGetFeed $EdFiNuGetFeed -NuGetApiKey $NuGetApiKey -PackageFile $PackageFile -DryRun:$DryRun
    #}  -Arguments @{
     #   EdFiNuGetFeed = $EdFiNuGetFeed;
     #   NuGetApiKey = $NuGetApiKey;
     #   PackageFile = $PackageFile;
     #   DryRun = $DryRun;
    #}
    Invoke-Expression { 
        PushPackage -EdFiNuGetFeed $EdFiNuGetFeed -NuGetApiKey $NuGetApiKey -PackageFile $PackageFile -DryRun:$DryRun
    }
}

function Invoke-Build {
    DotNetClean
    Restore
    Compile
}

function Invoke-BuildPackage {
    Invoke-Expression { BuildPackage }
}

function RunNuGetPack {
    param (
        [string]
        $ProjectPath,

        [string]
        $PackageVersion
    )
    $dotnetCommand = "dotnet pack $ProjectPath -c release -p:PackageVersion=$Version --output $PSScriptRoot"
    
    Invoke-Expression $dotnetCommand
}

function BuildPackage {
    #Write-Output "Building Package ($Version)"
    $mainPath = "$applicationRoot"
    $projectPath = "$mainPath/$projectName.csproj"

    $dotnetCommand = "RunNuGetPack -ProjectPath $projectPath -PackageVersion $Version"
    Invoke-Expression $dotnetCommand
}

function Invoke-Publish {
    #Write-Output "Building Version ($Version)"
    Invoke-Step { PublishApi }
}

function RunMetaEd {
    #Write-Host "Run MetadEd Project"
    $nodeInstall = "npm install"
    $nodeBuild = "npm run build"
    Invoke-Expression $nodeInstall
    Invoke-Expression $nodeBuild
    Set-Location -Path ./packages/metaed-console

    #Write-Host "Get Working Dir"
    Get-Location
    Get-ChildItem
    
    <#
    After building the project from the parent directory, we need to confirm it's functional using the following command,
    which will use the provided config file. For more details, 
    please refer to the readme file located in ./packages/meteaed-console/src/README.md
    #>
    $nodeCommand = 
            "node ./dist/index.js -a -c /home/runner/work/MetaEd-js/MetaEd-js/eng/ApiSchema/ApiSchemaPackaging-GitHub.json"

    Invoke-Expression $nodeCommand
}

function CopyMetaEdFiles {
    #Write-Output "Copy the MetaEd Files into the ApiSchema Folder"

    #Write-Output ("Copy the ApiSchema.json into the " + $solutionRoot)
    Copy-Item -Path ./MetaEdOutput/ApiSchema/ApiSchema/ApiSchema.json -Destination $solutionRoot
    
    #Write-Output ("Copy the XSD content into the " + $solutionRoot + "/xsd")
    Copy-Item -Path ./MetaEdOutput/EdFi/XSD/* -Destination $solutionRoot/xsd/
}

function Invoke-RunMetaEd {
    #Invoke-Step { RunMetaEd }
    RunMetaEd
}

function Invoke-CopyMetaEd {
    #Invoke-Step { CopyMetaEdFiles }
    CopyMetaEdFiles
}

#Invoke-Main {
    #param(
     #   [Parameter()]
    #    $Command
   # )
   # Write-Info "HERE"
   # switch ($Command) {
        #Clean { Invoke-Clean }
        #Build { Invoke-Build }
        #Unzip { Invoke-UnzipFile }
        #BuildAndPublish { 
        #    Invoke-Build             
        #    Invoke-Publish
        #}        
        #Package { Invoke-BuildPackage }
        #PushPackage { Invoke-PushPackage }
        #RunMetaEd { Invoke-RunMetaEd }
        #MoveMetaEdSchema { Invoke-CopyMetaEd }
  #      default { throw "Command '$Command' is not recognized" }
 #   }
#}

$MainFunction = {
    param (
        [ScriptBlock]
        $MainBlock
    )
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

& $MainFunction
