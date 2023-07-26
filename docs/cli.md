# Command Line Interface

Alternative to running MetaEd commands from within the IDE. Must have already built the code using `npm run build`.

## Build

The build process creates the following outputs:

1. Documentation
2. Metadata used by the ODS/API code generation
3. SQL scripts (both SQL Server and PostgreSQL)
4. XML/XSD files for bulk upload processes

This command does not take the additional step of loading files into the ODS/API build process; for that, see [Deploy](#deploy).

### Build Command Line Interface

```powershell
> node ./packages/metaed-console/dist/index.js -h
Usage: packages\metaed-console\dist\index.js [options]

Options:
  --config, -c                    Path to JSON config file
  --defaultPluginTechVersion, -x  The default technology version for all
                                  plugins, in semver format            [string]
  -a, --accept-license            Accept the Ed-Fi License Agreement at
                                  https://www.ed-fi.org/getting-started/license-
                                  ed-fi-technology           [string] [required]                                  
  --help, -h                      Show help                            [boolean]
  --version, -v                   Show version number                  [boolean]
```

A config file is implicitly required. See [Configuration File](#configuration-file) for help with using a config file.

### Build Output

The build process produces the following output, in the configured `artifactDirectory`:

```none
<artifactDirectory>
   └─ Documentation
      └─ DataDictionary
      └─ Ed-Fi-Handbook
      └─ UDM
   └─ EdFi
      └─ ApiMetadata
      └─ Database
      └─ Interchange
      └─ XSD
```

## Deploy

Copies the built artifacts into the ODS/API build process. The `deployDirectory` (see [Configuration
File](#configuration-file)) setting must point to the parent directory of the `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation`.

### Deploy Command Line Interface

```powershell
> node .\packages\metaed-odsapi-deploy\dist\index.js
Usage: index.js [options]

Config file:
  -c, --config  Path to JSON config file

Command line:
  -s, --source  The artifact source directories to scan                  [array]
  -t, --target  The deploy target directory                             [string]

Options:
  -p, --projectNames              The artifact source projectNames to override
                                                                         [array]
  -x, --defaultPluginTechVersion  The default technology version for all
                                  plugins, in semver format             [string]
      --core                      Deploy core in addition to any extensions
                                                      [boolean] [default: false]
      --suppressDelete            Suppress deletion of the SupportingArtifacts
                                  deployment folder   [boolean] [default: false]
  -a, --accept-license            Accept the Ed-Fi License Agreement at
                                  https://www.ed-fi.org/getting-started/license-
                                  ed-fi-technology           [string] [required]
  -h, --help                      Show help                            [boolean]
  -v, --version                   Show version number                  [boolean]

Missing required argument: accept-license
```

See [Configuration File](#configuration-file) for help with using a config file.

### Deploy Output

The deploy process produces the following output, in the configured `deployDirectory`:

```none
<deployDirectory>
   └─ Ed-Fi-ODS
      └─ Standard
         └─ Metadata
      └─ Database
         └─ Data
            └─ EdFi
         └─ Structure
            └─ EdFi
      └─ Database
         └─ Schemas
            └─ Interchange
            └─ XSD
   └─ Ed-Fi-ODS-Implementation
      └─ Application
         └─ EdFi.Ods.Standard
            └─ SupportingArtifacts
               └─ Metadata
                  └─ ApiModel.json
```

## Configuration File

Create a configuration file like the following, replacing `temp` with the desired
directory paths. Example for ODS/API 3.0.0 and Data Standard 3.0:

```javascript
{
    "metaEdConfiguration": {
        "artifactDirectory": "temp/MetaEdOutput",
        "deployDirectory": "d:/ed-fi",
        "pluginTechVersion": {},
        "projects": [{
            "projectName": "Ed-Fi",
            "namespaceName": "EdFi",
            "projectExtension": "",
            "projectVersion": "3.0.0"
            }],
        "projectPaths": ["./node_modules/@edfi/ed-fi-model-3.0/" ],
        "pluginConfigDirectories": [],
        "defaultPluginTechVersion": "3.0.0",
        "allianceMode": true
    }
}
```

Example for ODS/API 5.3.0 and Data Standard 3.3b, building a _local copy_ of the data
model (not in the `node_modules` directory).

```javascript
{
    "metaEdConfiguration": {
        "artifactDirectory": "temp/MetaEdOutput",
        "deployDirectory": "d:/ed-fi",
        "pluginTechVersion": {},
        "projects": [{
            "projectName": "Ed-Fi",
            "namespaceName": "EdFi",
            "projectExtension": "",
            "projectVersion": "3.3.1-b"
        }],
        "projectPaths": ["./ed-fi-model-3.3b/" ],
        "pluginConfigDirectories": [],
        "defaultPluginTechVersion": "5.3.0",
        "allianceMode": true
    }
}
```

TIP: Git will ignore this file if it is named `metaed.conf.json`.

Now run the MetaEd build or deploy process with that file:

```bash
node <correct module>/index.js -c metaed.conf.json -a
```