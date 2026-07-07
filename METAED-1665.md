# METAED-1665 — MetaEd v4.7 Deploy to 6.x API broken

**Ticket:** [METAED-1665](https://edfi.atlassian.net/browse/METAED-1665) (Bug, Medium, assigned to Johnny Brenes, due 2026-07-07)
**Clone of:** [EDFI-2792](https://edfi.atlassian.net/browse/EDFI-2792) (Done — customer case via Salesforce 00003061)
**Branch:** `METAED-1665` off `main` (v4.7.1-dev.7 line)

## Problem Statement

In MetaEd 4.7, deploying to an ODS/API **6.x** target reports success, but the `Artifacts`
folder is never created under `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.<Project>/`.
Deploying to 7.x works correctly (the `Versions` folder structure is created). MetaEd 4.6
worked for both targets. Reproduced by the reporter with both a customer extension project
and TPDM. Customer was told to roll back to 4.6.

## Root Cause (confirmed via git archaeology)

Commit `112b58f89` ([METAED-1621] "Update Supported DS Versions, remove 3.2c and 3.3b from
code", PR #418, first released in **v4.7.0**) deleted three tasks from
`packages/metaed-odsapi-deploy`:

| Deleted file | Version gate | Purpose |
| --- | --- | --- |
| `src/task/DeployCoreV6.ts` | `>=5.4.0 <7.0.0` | Copies core artifacts to `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts` |
| `src/task/DeployExtensionV6.ts` | `>=5.4.0 <7.0.0` | Copies extension artifacts to `EdFi.Ods.Extensions.<Project>/Artifacts` |
| `src/task/RemoveExtensionArtifactsV2andV3.ts` | `>=2.0.0 <3.3.0` | Removed legacy `SupportingArtifacts` (tech 2.x/3.x only) |

along with their integration tests (`DeployCoreV6.test.ts`, `DeployExtensionV6.test.ts`)
and their registrations in `src/RunDeployTasks.ts`.

METAED-1621's intent was to drop old **Data Standard** versions (3.2c, 3.3b). But the V6
deploy tasks are gated on `defaultPluginTechVersion` — the **ODS/API technology version** —
not the data standard version. ODS/API 6.1/6.2 are still supported targets (the VS Code
extension offers `metaed.targetOdsApiVersion` values 6.1, 6.2, 7.1, 7.2, 7.3 and maps
"6.1" → `defaultPluginTechVersion` "6.1.0"). The remaining `DeployCore.ts` / `DeployExtension.ts`
short-circuit with `success: true` when the tech version is `< 7.0.0`
(`DeployExtension.ts:118`, `DeployCore.ts:108`), so a 6.x deploy runs zero copy operations
and still reports success — exactly the reported symptom.

**Aggravating detail:** `RemoveExtensionArtifacts.ts` (gate `>=3.3.0`, path built at
`RemoveExtensionArtifacts.ts:20`) still runs on a 6.x deploy and **deletes** any existing
`EdFi.Ods.Extensions.<Project>/Artifacts` folder before the (now missing) deploy step. So
4.7 doesn't just skip the deploy — it destroys a previous deployment. This makes an
expedited patch appropriate (see Release Vehicle).

`RemoveExtensionArtifactsV2andV3` covered tech versions `<3.3.0`, which are genuinely
unsupported now — it will **not** be restored.

## Fix Approach

1. **Restore `DeployCoreV6.ts` near-verbatim** from `v4.6.0` into
   `packages/metaed-odsapi-deploy/src/task/`. (It uses only static paths — no `sugar`
   templating; only the old `DeployExtensionV6` used `Sugar.String.format`, and the
   modernized replacement won't.)
2. **Recreate `DeployExtensionV6.ts` modernized**, keeping it as close as possible to the
   current `DeployExtension.ts` structure — same shape, same
   `metaEdConfiguration.projects.filter((p) => !isDataStandard(p))` enumeration — differing
   only in the 6.x destination path (`EdFi.Ods.Extensions.<Project>/Artifacts`, no
   `Versions/.../Standard/...` segment, no DS-version formatting) and the version gate.
   This avoids the old `fs.readdirSync(artifactDirectory)` directory-name inference and the
   old behavior of deploying pseudo-extensions (the v4.6 test even deployed an
   `AdditionalScripts` folder as if it were an extension project).
3. **Version gate: keep the original `>=5.4.0 <7.0.0`** on both restored tasks.
   Rationale: `metaed-core` still defaults `defaultPluginTechVersion` to `'6.0.0'`
   (`packages/metaed-core/src/MetaEdConfiguration.ts:12`), so CLI/config paths that never
   set a tech version would be stranded by a `>=6.1.0` gate — `>=6.1.0` is rejected, not
   deferred. If a cleaner boundary is ever wanted, evaluate `>=6.0.0 <7.0.0` separately.
4. **Re-register** both tasks in `src/RunDeployTasks.ts` in their original order
   (`deployCoreV6Task` before `deployCoreTask`, `deployExtensionV6Task` before
   `deployExtensionTask` — each task self-gates by version so ordering is safe).
5. **Restore/update integration tests:**
   - `DeployCoreV6.test.ts` restored from v4.6.0, updated for any fixture drift.
   - `DeployExtensionV6.test.ts` rewritten for the modernized task — expectations must
     **not** include the `AdditionalScripts` pseudo-extension deployment. The test **must
     populate `metaEdConfiguration.projects`** with the extension project (e.g. `Sample`):
     the modernized task enumerates configured projects, so an empty `projects` list
     correctly deploys nothing — a test that forgets this would pass while exercising
     nothing. Set both `projectName: 'Sample'` and an explicit non-EdFi
     `namespaceName: 'Sample'` — `isDataStandard` only checks `namespaceName === 'EdFi'`
     (`packages/metaed-core/src/project/ProjectTypes.ts:33`), so relying on
     `newMetaEdProject()`'s empty-string default would pass the filter by accident and
     make the test less meaningful. Assert the expected copied files with inline snapshots
     or explicit file paths so a "success with no output" run fails the test. Same
     requirements apply to the `runDeployTasks` test below.
   - **New: a focused gate test at `defaultPluginTechVersion` `'6.0.0'`** — the repo
     default from `MetaEdConfiguration.ts:12` — proving both V6 tasks execute (deploy, not
     no-op) at that version. This locks in the `>=5.4.0 <7.0.0` gate decision so a future
     narrowing to `>=6.1.0` fails a test instead of silently stranding the default.
   - **New:** a `runDeployTasks`-level integration test for a 6.x target proving the full
     delete-then-copy sequence (`RemoveExtensionArtifacts` removes the existing `Artifacts`
     folder, then the V6 task recreates and populates it). **Fixture caveat:** don't reuse
     the shared `test/integration/artifact/` fixture as-is — it contains an
     `AdditionalScripts` folder under the artifact root, and `ExtensionProjectsExists`,
     `RemoveExtensionArtifacts`, and `RefreshProject` still enumerate artifact folders
     (`directoryExcludeList` is only `ApiSchema`/`Documentation`/`EdFi`), so
     `AdditionalScripts` would be treated as a project at the pipeline level. Use a clean
     fixture containing only `EdFi` and `Sample`, or keep optional scripts outside the
     artifact root for this test.
6. Verify package health: `npx jest packages/metaed-odsapi-deploy`, then directory-level
   `npx eslint --max-warnings 0 --ext .js,.ts packages/metaed-odsapi-deploy` and
   `npx tsc -p packages/metaed-odsapi-deploy --noEmit`.

## Verification

Verification is split into a **blocking PR gate** and a **non-blocking extended smoke**.
The fix PR ships when the gate is green; the extended editor QA matrix is follow-up work
that must not hold the customer fix hostage.

### PR gate (blocking)

1. Restored/updated V6 integration tests pass, including the new `runDeployTasks` 6.x
   delete-then-copy test and the focused 6.0.0 default-gate test.
2. Full deploy-package test suite, lint, and type check green.
3. Smoke S1–S4 below (6.1, 6.2, 7.3 regression, re-deploy overwrite).
4. Smoke S15: one TPDM deploy to 6.1 or 6.2 — proves the reported real-world case.

### Setup for smoke tests

- Wire the locally built 4.7.1-dev MetaEd packages into `C:\Simpat\vscode-metaed-ide`
  (currently pinned to `@edfi/*` 4.6.1-dev.3) using **`npm pack` tarballs referenced via
  `file:` in package.json** — reproducible and reviewable. Do not copy files into
  `node_modules/@edfi` directly. Run the extension via the Extension Development Host.
  **Producing the tarballs:** published packages contain only `/dist` (+ LICENSE and
  package.json), so the packages must be transpiled first via `npx lerna run build --stream`
  (each package's `build` script = clean + copy non-TS + tsc — this *does* trigger package
  build scripts, even though it isn't literally `npm run build`). The repo rule "never run
  `npm run build`" targets the day-to-day dev loop — transpiling is "only needed for
  package publishing", and packing smoke-test tarballs *is* that publishing case. Framing:
  this is an **exceptional packaging/smoke-setup step, defensible for `npm pack` and
  nothing else — it must not become normal validation**. T7 is blocking smoke setup (the
  gated smoke tests S1–S4/S15 depend on it), but `dist/` output is not a validation
  signal — verification comes from Jest/ESLint/tsc (T6), which must be green before the
  transpile runs.
- Deploy target: a folder-skeleton set via `metaed.odsApiDeploymentDirectory`. It needs
  more than the two top-level folders: `ExtensionProjectsExists.ts:13` fails the deploy
  unless `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.<Project>/` exists for
  every extension project in the artifact directory. Minimum skeleton:
  - `Ed-Fi-ODS/`
  - `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/` (or the simple
    extension's project name)
  - `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.TPDM/` (for S15)

  Folder-skeleton verification is sufficient for the code fix (the bug is artifact
  placement). A real ODS/API 6.x source checkout + PowerShell `initdev` run is good
  release confidence but non-blocking.
- DS/ODS pairings (per the extension's `odsApiToDsVersionRange` map and bundled models):
  **DS 4.0 + 6.1**, **DS 4.0 + 6.2** (6.x targets require DS 4.0 exactly), and
  **DS 6.0 + 7.3** for the 7.x regression (7.3 accepts DS >=4.0.0; DS 6.0 is the newest
  bundled model).

### Smoke Test Matrix

Blocking (PR gate):

| # | Area | Test | Expected |
| --- | --- | --- | --- |
| S1 | **Deploy 6.1 (the bug)** | DS 4.0 project + simple extension; Build then Deploy with target 6.1 | `EdFi.Ods.Extensions.<Project>/Artifacts/{Metadata, MsSql, PgSql, Schemas}` created and populated |
| S2 | **Deploy 6.2** | Same as S1 with target 6.2 | Same as S1 |
| S3 | **Deploy 7.3 (regression)** | DS 6.0 project + extension, target 7.3 | `EdFi.Ods.Extensions.<Project>/Versions/<projVer>/Standard/<dsVer>/Artifacts/...` created; 6.x-style `Artifacts` folder NOT created |
| S4 | **Re-deploy overwrite** | Deploy 6.1 twice in a row | Second deploy removes and recreates `Artifacts` cleanly, no stale files |
| S15 | **TPDM on 6.x** | TPDM as the extension project (a checkout **compatible with DS 4.0 / ODS/API 6.x** — a mismatched TPDM version could masquerade as a deploy regression); Build + Deploy to 6.1 (or 6.2) | TPDM artifacts land in `EdFi.Ods.Extensions.TPDM/Artifacts/...` |

Non-blocking (extended editor smoke, follow-up to the fix PR):

| # | Area | Test | Expected |
| --- | --- | --- | --- |
| S5 | **ODS target switching** | Switch `metaed.targetOdsApiVersion` 6.1 → 7.3 → 6.1, building each time with the appropriate DS project | Build succeeds each time; artifacts reflect the target |
| S6 | **DS/ODS mismatch** | DS 5.x project with target 6.1 (and DS 4.0 with 7.3 is allowed — verify the 6.1 case errors) | Clear compatibility error notification, no crash |
| S7 | **DS version switching** | Build with ed-fi-model-4.0, then swap workspace to ed-fi-model-6.0 (target 7.3) | Both build successfully |
| S8 | **Garbage in a file** | Paste invalid text into a `.metaed` file (extension project) | Squiggles + Problems-tab entries with sensible messages; errors clear after revert |
| S9 | **Validation errors** | Remove `documentation`, remove identity, reference nonexistent entity, duplicate property name | Expected validator/parser messages appear (per QA spreadsheet patterns) |
| S10 | **Simple extension build** | New extension: `package.json` with `metaEdProject`, standard folder structure, one DomainEntity + one Descriptor; Build | Build success message; `MetaEdOutput/<Extension>/` artifacts generated (ApiMetadata, Database, XSD, Interchange) |
| S11 | **License gating** | Deploy with `metaed.acceptedLicense` unchecked | "You must first accept the Ed-Fi License Agreement" message; nothing deployed |
| S12 | **Missing deploy dir** | Deploy with `metaed.odsApiDeploymentDirectory` empty | "To deploy, set Ods Api Deployment Directory in Workspace settings." message |
| S13 | **Core file edit protection** | Edit a core DS file without Alliance Mode | Warning/override prompt on save |
| S14 | **Delete referenced file** | Delete a domain entity file another file references; Build | Reference errors appear in Problems tab |

## Release Vehicle

Expedited **4.7.x patch/prerelease** once the PR gate is green — a customer is blocked and
rolled back to 4.6, and 4.7 actively deletes existing 6.x extension `Artifacts` before
silently no-oping, so waiting for a normal release train is risky.

## Deliverables

1. Fix PR on branch `METAED-1665`: restored `DeployCoreV6` (near-verbatim), modernized
   `DeployExtensionV6` (projects-based), re-registration, restored/updated/new tests.
2. Blocking smoke results (S1–S4, S15) recorded in this file before PR merge; extended
   smoke results (S5–S14) appended as follow-up.
3. Jira ticket updated with root cause, fix summary, and results; any new bugs found during
   the extended smoke filed as separate tickets.
4. Coordination of the expedited 4.7.x patch release.

## Decisions (formerly Open Questions)

1. **Version gate:** keep `>=5.4.0 <7.0.0` for the hotfix. `>=6.1.0` is rejected — it
   would miss the repo default `defaultPluginTechVersion` of `'6.0.0'`, and a focused test
   at 6.0.0 locks this in. If a cleaner boundary is wanted later, evaluate
   `>=6.0.0 <7.0.0` as separate follow-up work.
2. **Verbatim vs. modernize:** `DeployCoreV6` near-verbatim; `DeployExtensionV6` modernized
   to `metaEdConfiguration.projects` + `isDataStandard()`, eliminating directory-name
   inference and the `AdditionalScripts` pseudo-project behavior.
3. **Deploy verification depth:** folder-skeleton is sufficient for the code fix; add a
   `runDeployTasks`-level 6.x delete-then-copy test. Real ODS/API 6.x checkout smoke is
   non-blocking release confidence.
4. **Dev-build wiring:** `npm pack` local tarballs referenced via `file:` in
   `vscode-metaed-ide/package.json`. No manual copying into `node_modules/@edfi`. The
   required transpile is smoke/release setup only — never normal dev verification.
5. **Pairings:** DS 4.0 + 6.1, DS 4.0 + 6.2, DS 6.0 + 7.3 (7.x regression).
6. **Release vehicle:** expedited 4.7.x patch/prerelease.
7. **TPDM:** yes — one TPDM deploy smoke on 6.1 or 6.2 (S15), blocking for the PR.

## Results

*To be filled in as tasks complete.*

### PR gate results

| Check | Result | Notes |
| --- | --- | --- |
| V6 integration tests (incl. runDeployTasks 6.x delete-then-copy) | ✅ Pass (2026-07-07) | `DeployCoreV6.test.ts`, `DeployExtensionV6.test.ts`, `DeployV6AtDefaultTechVersion.test.ts` (6.0.0 default-gate), `RunDeployTasksV6.test.ts` (delete-then-copy, stale artifact removed) |
| Package tests / lint / tsc | ✅ Pass (2026-07-07) | Jest: 6 suites / 16 tests / 7 snapshots. `eslint --max-warnings 0` clean. `tsc --noEmit` clean. |
| S1 Deploy 6.1 | ✅ Pass (2026-07-07) | Via Extension Development Host (local 4.7.1-dev.7 tarballs), DS 4.0 + Sample ext. `EdFi.Ods.Extensions.Sample/Artifacts/{Metadata,MsSql,PgSql,Schemas}` created & populated, 1:1 with build output; no 7.x `Versions/` structure; no `Data/` folder deployed because the minimal project generates none (correct skip). |
| S2 Deploy 6.2 | ✅ Pass (2026-07-07) | Same workspace switched to target 6.2; Build + Deploy. Layout identical to S1 (29 files under `EdFi.Ods.Extensions.Sample/Artifacts/`), fresh file timestamps confirm re-deploy, no 7.x `Versions/` structure. |
| S3 Deploy 7.3 regression | ✅ Pass (2026-07-07) | DS 6.0 + Sample ext at 7.3 (build confirmed `odsApiVersion: 7.3`). `Versions/1.0.0/Standard/6.0.0/Artifacts/...` created; 6.x-style `Artifacts` folder removed by cleanup and NOT recreated (V6 tasks no-op at >=7.0.0). Deployed set mirrors build output (no Interchange/XSD generated at 7.3 — expected). First attempt accidentally re-ran 6.2 in the wrong Dev Host window; detected via `odsApiVersion` in build output and repeated correctly. |
| S4 Re-deploy overwrite | ✅ Pass (2026-07-07) | Stale marker file seeded into deployed `Artifacts/MsSql/Data/` was removed by re-deploy; all 29 artifacts recreated byte-listing-identical. Note: empty `MsSql/Data/Ods` dir appears in every deploy — faithful copy of the build's empty `Database/SQLServer/ODS/Data/` output dir (same as v4.6 behavior), not stale state. |
| S15 TPDM on 6.x | ✅ Pass (2026-07-07) | TPDM-Core 1.1.0 (repo `tpdm-project` fixture, pre-validated DS 4.0-compatible) + DS 4.0, target 6.1 via Dev Host. Build confirmed `odsApiVersion: 6.1`; 34 files deployed to `EdFi.Ods.Extensions.TPDM/Artifacts/{Metadata,MsSql,PgSql,Schemas}`. Reproduces the customer's reported case, now working. |

### Extended smoke results

| Check   | Result | Notes |
| ------- | ------ | ----- |
| S5–S14  | —      |       |
