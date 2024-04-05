# Creating MetaEd Releases

* Confluence
  * Update the what's new page.
* MetaEd-Js repo
  * Create a release.
* vscode-metaed-ide repo
  * Make sure the version in the `package.json` has been bumped appropriately.
  * Create a pre-release with the desired version number (e.g. "v4.0.0"). Link to the Tech Docs release notes.
  * Wait until the "on-prerelease" workflow is done.
  * Change the pre-release to a release.
  * That action triggers the work of publishing out to the Visual Studio Marketplace.
* Jira
  * Go to releases page for MetaEd project, find the release.
  * If there are any open tickets, remove them from the release.
  * "Release" the release.