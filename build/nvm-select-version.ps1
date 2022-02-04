[CmdletBinding()]
param (
    [Parameter(Mandatory=$True)]
    [string]
    $version
)

nvm version
nvm install $version
nvm use $version
npm version
