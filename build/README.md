# Data Model Build Script

Cross-platform build script that will install the latest dev release of MetaEd
and then run the build process on the Ed-Fi model files.

## Usage

```bash
index.js [options]
```

### Config file

| Short | Long     |
| ----- | -------- |
| -c    | --config |

### Command line

| Short | Long     | Description                             | Data type / default |
| ----- | -------- | --------------------------------------- | ------------------- |
| -s    | --source | The artifact source directories to scan | [array]             |
| -t    | --target | The deploy target directory             | [string]            |

### Options

| Short | Long                       | Description                                                      | Data type / default        |
| ----- | -------------------------- | ---------------------------------------------------------------- | -------------------------- |
| -p    | --projectNames             | The artifact source projectNames to override                     | [array]                    |
| -x    | --defaultPluginTechVersion | The default technology version for all plugins, in semver format | [string]                   |
|       | --core                     | Deploy core in addition to any extensions                        | [boolean] [default: false] |
|       | --suppressDelete           | Suppress deletion of the SupportingArtifacts deployment folder   | [boolean] [default: false] |
| -h    | --help                     | Show help                                                        | [boolean]                  |
| -v    | --version                  | Show version number                                              | [boolean]                  |
