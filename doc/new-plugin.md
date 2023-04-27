## Creating a new metaed plugin package

The best approach for creating a new plugin is to use the existing ones as a reference.

1. Create a new folder in the packages folder.
2. Copy the top level files from one monorepo package to the new one
3. run `lerna bootstrap`.
4. Add that new package to the dependencies in vscode-metaed's package.json. This is on [vscode-metaed-ide](https://github.com/Ed-Fi-Alliance-OSS/vscode-metaed-ide) repository
