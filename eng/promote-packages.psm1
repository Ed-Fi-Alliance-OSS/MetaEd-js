# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

$ErrorActionPreference = "Stop"
<#
.DESCRIPTION
Promotes a package in Azure Artifacts to a view, e.g. pre-release or release.
#>
function Invoke-Promote {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSReviewUnusedParameter', '', Justification = 'False positive')]
    param(
        # NuGet Packages API URL
        [Parameter(Mandatory = $true)]
        [String]
        $PackagesURL,

        # Azure Artifacts user name
        [Parameter(Mandatory = $true)]
        [String]
        $Username,

        # Azure Artifacts password
        [Parameter(Mandatory = $true)]
        [SecureString]
        $Password,

        # View to promote into. This will be a Guid
        [Parameter(Mandatory = $true)]
        [String]
        $ViewId,

        # Git ref (short) for the release tag ex: v1.3.5
        [Parameter(Mandatory = $true)]
        $ReleaseRef
    )

    $packages = @(
        "@edfi/metaed-console"
        "@edfi/metaed-core"
        "@edfi/metaed-default-plugins"
        "@edfi/metaed-odsapi-deploy"
        "@edfi/metaed-plugin-edfi-handbook"
        "@edfi/metaed-plugin-edfi-ods-changequery"
        "@edfi/metaed-plugin-edfi-ods-changequery-postgresql"
        "@edfi/metaed-plugin-edfi-ods-changequery-sqlserver"
        "@edfi/metaed-plugin-edfi-ods-postgresql"
        "@edfi/metaed-plugin-edfi-ods-recordownership"
        "@edfi/metaed-plugin-edfi-ods-recordownership-postgresql"
        "@edfi/metaed-plugin-edfi-ods-recordownership-sqlserver"
        "@edfi/metaed-plugin-edfi-ods-relational"
        "@edfi/metaed-plugin-edfi-ods-sqlserver"
        "@edfi/metaed-plugin-edfi-odsapi"
        "@edfi/metaed-plugin-edfi-sql-dictionary"
        "@edfi/metaed-plugin-edfi-unified"
        "@edfi/metaed-plugin-edfi-unified-advanced"
        "@edfi/metaed-plugin-edfi-xml-dictionary"
        "@edfi/metaed-plugin-edfi-xsd"
    )
    $version = $ReleaseRef.substring(1)

    ForEach ($package in $packages) {
        $body = '
        {
            "data": {
                "viewId": "' + $ViewId + '"
            },
            "operation": 0,
            "packages": [
                {
                    "id": "' + $package + '",
                    "version": "' + $version + '"
                }
            ]
        }'
    
        $parameters = @{
            Method      = "POST"
            ContentType = "application/json"
            Credential  = New-Object -TypeName PSCredential -ArgumentList $Username, $Password
            URI         = $PackagesURL
            Body        = $body
        }
    
        $parameters | Out-Host
        $parameters.URI | Out-Host
        $parameters.Body | Out-Host
    
        $response = Invoke-WebRequest @parameters -UseBasicParsing
        $response | ConvertTo-Json -Depth 10 | Out-Host
    }    
}

Export-ModuleMember -Function Invoke-Promote
