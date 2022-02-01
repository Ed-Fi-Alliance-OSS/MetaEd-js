As of Feb 2022, publishing to Azure Artifacts with Yarn 2 requires a very different set up from the Azure Artifacts
instructions for publishing with NPM. Short version:

1. Generate a Personal Access Token.
2. Prepend that token with Azure Artifacts 'org name'/'project name', separated from
the token by a colon. For example, given org name "ed-fi-alliance", project name "Ed-Fi-Alliance-Closed", and
personal access token "ABC123", the string would be "ed-fi-alliance/Ed-Fi-Alliance-Closed:ABC123".
3. Base-64 encode the above string. With bash: 'echo -n "ed-fi-alliance/Ed-Fi-Alliance-Closed:ABC123" | base64'
4. Create a .yarnrc.yml file in your home directory. Add an npmScopes entry, with a sub-entry of the scope name without
at-sign (example below is scope @edfi), followed by sub-entries for npmRegistryServer and npmAuthIdent. npmRegistryServer
should be the typical registry url for the scope. npmAuthIdent should be the Base-64 encoded string from above. Example:

        npmScopes:
          edfi:
            npmRegistryServer: "https://pkgs.dev.azure.com/ed-fi-alliance/Ed-Fi-Alliance-Closed/_packaging/edfi-metaed/npm/registry/"
            npmAuthIdent: "BASE64_ENCODED_STRING_FROM_ABOVE"
