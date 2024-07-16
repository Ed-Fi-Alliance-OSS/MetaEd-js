[CmdLetBinding()]
param (
    [string]
    [ValidateSet("Clean", "Build", "BuildAndPublish", "Push", "Unzip")]
     $Command = "Build",

    #[Parameter(Mandatory=$true)]
    [String]
    $Version="5.1.0",

    #[Switch]
    #$Publish,

    [ValidateSet("Debug", "Release")]
    $Configuration = "Debug"
)

$solutionRoot = "$PSScriptRoot"
$defaultSolution = "$solutionRoot/EdFi.ApiSchema.sln"
Import-Module -Name "$PSScriptRoot/../../eng/build-helpers.psm1" -Force

#&dotnet build -c release -p:Version=$Version
#&dotnet pack -c release -p:PackageVersion=$Version -o .

#if ($Publish) {
#    # Must have https://github.com/microsoft/artifacts-credprovider#azure-artifacts-credential-provider

#    dotnet nuget push --source "EdFi" --api-key az "EdFi.ApiSchema.$($Version).nupkg" --interactive
#}

function Restore {
    Invoke-Execute { dotnet restore $defaultSolution }
}

function DotNetClean {
    Invoke-Execute { dotnet clean $defaultSolution -c $Configuration --nologo -v minimal }
}

function Invoke-Clean {
    Invoke-Step { DotNetClean }
}

function RunNuGetPack {
    param (
        [string]
        $ProjectPath,

        [string]
        $PackageVersion,

        [string]
        $nuspecPath
    )

    $copyrightYear = ${(Get-Date).year)}
    # NU5100 is the warning about DLLs outside of a "lib" folder. We're
    # deliberately using that pattern, therefore we bypass the
    # warning.
    
    #&dotnet pack -c release -p:PackageVersion=$Version -o .
    dotnet pack $ProjectPath --no-build --no-restore --output $PSScriptRoot -p:NuspecFile=$nuspecPath -p:NuspecProperties="version=$PackageVersion;year=$copyrightYear" /p:NoWarn=NU5100
}

function Compile {
    Invoke-Execute {
        dotnet build $defaultSolution -c $Configuration -p:Version=$Version --nologo --no-restore
        #&dotnet build -c release -p:Version=$Version
        #&dotnet pack -c release -p:PackageVersion=$Version -o .
    }
}

function PublishApi {
    Invoke-Execute {
        $project = "$applicationRoot/$projectName/"
        $outputPath = "$project/publish"
        dotnet publish $project -c $Configuration -o $outputPath --nologo
    }
}

function Invoke-UnzipFile {    
    New-Item -ItemType Directory -Path ../apiSchemaPackage
    Copy-Item -Path ../ApiSchema/* -Destination ../apiSchemaPackage/ -Recurse
    Invoke-WebRequest "https://odsassets.blob.core.windows.net/public/project-tanager/5.1.0-xsd-and-metadata.zip" -OutFile ../apiSchemaPackage/json-and-xsd-5.1.0.zip
    Expand-Archive -Path ../apiSchemaPackage/json-and-xsd-5.1.0.zip -Destination ../apiSchemaPackage/    
}

function PushPackage {
    Invoke-Execute {
        if (-not $NuGetApiKey) {
            throw "Cannot push a NuGet package without providing an API key in the `NuGetApiKey` argument."
        }

        if (-not $EdFiNuGetFeed) {
            throw "Cannot push a NuGet package without providing a feed in the `EdFiNuGetFeed` argument."
        }

        if (-not $PackageFile) {
            $PackageFile = "$PSScriptRoot/$packageName.$DMSVersion.nupkg"
        }

        if ($DryRun) {
            Write-Info "Dry run enabled, not pushing package."
        }
        else {
            Write-Info ("Pushing $PackageFile to $EdFiNuGetFeed")

            dotnet nuget push $PackageFile --api-key $NuGetApiKey --source $EdFiNuGetFeed
        }
    }
}

function Invoke-PushPackage {
    Invoke-Step { PushPackage }
}

function Invoke-Build {
    Invoke-Step { DotNetClean }
    Invoke-Step { Restore }
    Invoke-Step { Compile }
}

Invoke-Main {
    #if ($IsLocalBuild) {
    #    $nugetExePath = Install-NugetCli
    #    Set-Alias nuget $nugetExePath -Scope Global -Verbose
    #}
    switch ($Command) {
        Clean { Invoke-Clean }
        Build { Invoke-Build }
        Unzip { Invoke-UnzipFile }
        BuildAndPublish { Invoke-Build }
        default { throw "Command '$Command' is not recognized" }
    }
}
