# metaed-js

MetaEd is:

* a [domain-specific language](./docs/metaed-as-language.md) (DSL) for documenting data models;
* a file extension (`.metaed`);
* and an IDE for working with those files (via Visual Studio Code).

This repository contains the core code for the DSL and transformation logic that turns the data model files into other useful
artifacts, such as SQL scripts and model files used to generate an API application. Unlike the rest of the Ed-Fi Alliance's
software, this core MetaEd code remains proprietary - it is not released under an open source license. However, the [Visual
Studio Code integration](https://github.com/Ed-Fi-Alliance-OSS/vscode-metaed-ide) _is_ public. There is no proprietary
information in the VS Code extension, and the Alliance benefits in that all GitHub Actions minutes in the public repository
are free, whereas there are limits on those minutes in this private repository.

A curious explorer may stumble on several archived code repositories containing the original C# IDE and its replacement Atom
integration. The VS Code solution is the only one used and supported starting from spring, 2023.

See [docs](./docs) for more developer documents.

## Legal Information

Copyright (c) 2024 Ed-Fi Alliance, LLC