# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

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
