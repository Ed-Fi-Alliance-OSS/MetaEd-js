# EdFi.ApiSchema

API Schema definition file representing the core Ed-Fi Data Standard, without extensions.

1. Need to add some large json and xsd files to this folder:
   1. `./EdFi.DataStandard-x.y.z-ApiSchema.json` from MetaEd
   2. `./dependencies.json` from ODS/API, built _without TPDM_
   3. `./descriptors-swagger.json` from ODS/API, without TPDM
      1. Replace `http://localhost:5176` with `HOST_URL`
      2. Update the version at the top, should be `5.1.0`, not `3`.
   4. `./resources-swagger.json`... see notes above.
   5. `./xsd/` - all of the XSD files from the ODS/API
2. Run `./build.ps1 Package -Version x.y.z` to test the NuGet package build process
3. Run `./build.ps1 PushPackage -Version x.y.z` to push to Azure Artifacts

The `dependencies`, `*-swagger`, and `xsd` files for a given Data Standard version are
compressed into a zip file stored in Azure. Unzip that file into this directory before
building the NuGet package, but do not commit the file into the repository.

## Legal Information

Copyright (c) 2024 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
