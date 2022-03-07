# Command Line Interface

Alternative to running MetaEd commands from within the Atom IDE.

## metaed:build

### Command

Command line options for `yarn metaed:build` are available with the `-h` flag:

```powershell
> yarn metaed:build -h

yarn run v1.21.1
$ node ./packages/metaed-console/dist/index.js -h
Usage: packages\metaed-console\dist\index.js [options]

Options:
  --config, -c                    Path to JSON config file
  --defaultPluginTechVersion, -x  The default technology version for all
                                  plugins, in semver format            [string]
  --help, -h                      Show help                            [boolean]
  --version, -v                   Show version number                  [boolean]
```

### Configuration

Create a configuration file like the following, replacing `temp` with the desired
directory paths. Example for ODS/API 3.0.0 and Data Standard 3.0:

```javascript
{
    "metaEdConfiguration": {
        "artifactDirectory": "temp/MetaEdOutput",
        "deployDirectory": "temp/deploy",
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
        "artifactDirectory": "MetaEdOutput",
        "deployDirectory": "deploy",
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

Now run the MetaEd build process with that file:

```bash
yarn metaed:build -c metaed.conf.json
```

### Output

For the first configuration above, output files are in 
`node_modules\ed-fi-model-3.0\temp\MetaEdOutput`:

```none
node_modules\ed-fi-model-3.0\temp\MetaEdOutput
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
