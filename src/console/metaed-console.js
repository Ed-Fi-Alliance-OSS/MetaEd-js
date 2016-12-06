// @flow
import commander from 'commander';
import winston from 'winston';
import start from '../core/tasks/Pipeline';
import { StateInstance } from '../core/State';
import type { State } from '../core/State';

commander.version('0.8')
.option('--edfi <coreDir>', 'The base path where core MetaEd files will be loaded from. The directory must currently exist.')
.option('--ext <extensionDir>', 'The base path where extension MetaEd files will be loaded from. If provided, the directory must currently exist.')
.parse(process.argv);

winston.level = 'info';

winston.info(`Executing MetaEd Console on ${commander.edfi}`);
winston.info('');

const state: State = new StateInstance({
  inputDirectories: [
    {
      path: commander.edfi,
      namespace: 'edfi',
      projectExtension: '',
      isExtension: false,
    },
    {
      path: commander.ext,
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    },
  ],
});

const endState: State = start(state);

endState.get('errorMessageCollection').forEach(
  message => winston.error(`${message.filename}(${message.lineNumber},${message.characterPosition}): ${message.message}`));

winston.info('');
winston.info('MetaEd Console Execution Completed');

/*
 namespace MetaEd.Console
 {
 public class MetaEdArgs
 {
 [ArgRequired]
 [ArgShortcut("o")]
 [ArgDescription("[required] The base path where generated files will be written. The directory must currently exist.")]
 [ArgExistingDirectory]
 public string Output { get; set; }

 [DefaultValue(OutputDirectoryStyle.NewSubdirectory)]
 [ArgDescription("Indicates how the output path should be managed.")]
 public OutputDirectoryStyle DeleteOrSubdirectory { get; set; }

 [DefaultValue(false)]
 [ArgShortcut("extOnly")]
 [ArgDescription("Optional flag indicating the core artifacts should not be generated.")]
 public bool SkipCoreOutput { get; set; }

 [DefaultValue(ArtifactGeneration.All)]
 [ArgDescription("Optionally specify which artifacts to generate. If not specified, all artifacts are generated.")]
 public ArtifactGeneration ArtifactGeneration { get; set; }

 [ArgShortcut("p")]
 [ArgDescription("The MetaEd project file. The file must currently exist.")]
 [ArgExistingFile]
 public string Project { get; set; }

 [ArgShortcut("edfi")]
 [ArgDescription("The base path where core MetaEd files will be loaded from. The directory must currently exist.")]
 [ArgExistingDirectory]
 public string EdFiMetaEdSourceDirectory { get; set; }

 [ArgShortcut("ext")]
 [ArgDescription("The base path where extension MetaEd files will be loaded from. If provided, the directory must currently exist.")]
 [ArgExistingDirectory]
 public string ExtensionMetaEdSourceDirectory { get; set; }

 [ArgRequired(If = "ExtensionMetaEdSourceDirectory")]
 [ArgShortcut("prefix")]
 [ArgDescription("The project specific prefix for xsd extension generation. Required if specifying extension MetaEd files.")]
 public string ExtensionProjectPrefix { get; set; }

 [ArgRequired]
 [ArgDescription("[required] The Ed-Fi core major version.")]
 public string MajorVersion { get; set; }

 [ArgRequired]
 [ArgDescription("[required] The Ed-Fi core minor version.")]
 public string MinorVersion { get; set; }

 [ArgDescription("The Ed-Fi core revision version.")]
 public string RevisionVersion { get; set; }

 [ArgDescription("The Ed-Fi Alliance copyright year.")]
 public string CopyrightYear { get; set; }
 }

 public enum OutputDirectoryStyle
 {
 [ArgShortcut("new")]
 [ArgDescription("(new) [default] Create a new subdirectory in the specified Output path")]
 NewSubdirectory,
 [ArgShortcut("delete")]
 [ArgDescription("(delete) Delete all contents of the specified Output path before starting generation")]
 DeleteContents
 }
 }
 */
