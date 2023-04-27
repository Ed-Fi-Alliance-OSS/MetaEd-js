## Creating a new metaed plugin package

The best approach for creating a new plugin is to use the existing ones as a reference.

1. Create a new folder in the packages folder.
2. Copy the structure and top level files from one monorepo package to the new one. It will look something like this:

```none
<new-plugin-folder>
   └─ src
      └─ ...
   └─ test
      └─ ...
    index.ts
    LICENSE.md
    package.json
    tsconfig.json
```

4. run `lerna bootstrap`.
5. Add that new package to the dependencies in vscode-metaed's package.json. This is on [vscode-metaed-ide](https://github.com/Ed-Fi-Alliance-OSS/vscode-metaed-ide) repository.
