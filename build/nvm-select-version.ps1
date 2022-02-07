[CmdletBinding()]
param (
    [Parameter(Mandatory=$True)]
    [string]
    $version
)

nvm version
nvm install $version
nvm use $version

# wait a few seconds before running the following, making it less likely to have a misleading failure
Start-Sleep -Seconds 5

npm version
