# MetaEd as a Language

The MetaEd DSL is fully described in the public [Language
Specification](https://edfi.atlassian.net/wiki/spaces/METAED20/pages/23710226/Language+Specification) documentation.

Currently the language itself is on major version 3. This is a little confusing, in that the cores packages in this
repository are on version 4.x. Where you see the language version showing up is in the data model packages. The `version` in
the `package.json` files for the model files reflects the _language version_. The Data Standard version is in the name of the
package (e.g. `ed-fi-model-5.0`). Having different package names for each model version allows them to easily coexist in the
same bundle, for example as dependencies in the VS Code extension.

The language does not change often, and we do not have a smooth procedure for handling changes. If we ever remove a language
feature, that would constitute a breaking change. The language version would become 4.x. Will model packages with `3.0.0` in
the version continue to build, despite the version mismatch? And would it build under the version 3 language definition, or
the new language definition? These details will need to be worked out before the next breaking change. Non-breaking changes
are not a concern. However, we do not have a good mechanism for indicating the language version numbers in code or in Tech
Docs. Also something to think about in the future.

In the case of a breaking change, we might need to have an internal fork of the `metaed-core` or another package, and use
configuration settings to determine which package name to load during build and deploy.
