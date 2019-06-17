MetaEd-IDE Release Process
===
Deployment is from a local machine.  This process requires a MyGet account with permissions to the Ed-Fi npm feed.  If this is in preparation for a production release, be sure to schedule QA time with a BA to execute test cases.
 
 
metaed-js
--- 
1. Be sure MetaEd-js is up to date at the correct commit (usually development).  Run `npm install` if you are out of date.
2. Run `npm run prep-for-publish` and make sure everything passes.
3. For a dev release, run `npm run publish-dev`.  For a production release, copy the publish-dev script (in the root package.json file) to the command line and modify the lerna parameters as appropriate.  (https://lernajs.io/)
4. Lerna will publish every package to the Ed-Fi npm feed.  Go to MyGet, confirm and pin the new versions.
 
 
IDE deployment
---
Now it's time to test out the deployment.
1. In the IDE install directory, run `npm install atom-metaed@<new-version>`.  The end of the upgrade output will list the updated packages with versions.  Confirm all packages (atom-metaed, metaed-core, and all metaed-plugin-*) are included with the correct new versions.
2. Start Atom and confirm version in the MetaEd -> About menu matches the expected **atom-metaed** and plugin versions.
3. Try a few things out as smoke test.  If this is a precursor to a production release, have QA execute test cases.
 
 
Rollback
---
If a production release is a disaster, rollback is easy.  We *never* delete releases even if they are broken, because we want to maintain history.  Instead, we rollback which published version is "latest", and therefore the default for installs and upgrades.
1. From the command-line at the **atom-metaed** repo, run `npm dist-tag add atom-metaed@<version-to-rollback-to> latest`
2. In MyGet find that version and confirm that version has the "latest" tag, as listed on the right side under "Keywords".  It should look like "dist-tag:latest".  Double-check that it is pinned.  The deployment is now rolled back.
3. IDE installations that need to rollback can then run `npm install atom-metaed@<version-to-rollback-to>`.
 