import { newMetaEdConfiguration } from './MetaEdConfiguration';
import { newMetaEdEnvironment } from './MetaEdEnvironment';
import { newPipelineOptions } from './pipeline/PipelineOptions';
import type { MetaEdConfiguration } from './MetaEdConfiguration';
import type { ValidationFailure } from './validator/ValidationFailure';
import type { PipelineFailure } from './pipeline/PipelineFailure';
import type { EnhancerResult } from './enhancer/EnhancerResult';
import type { GeneratorResult } from './generator/GeneratorResult';
import type { InputDirectory } from './file/InputDirectory';
import type { FileSet } from './file/MetaEdFile';
import type { FileIndex } from './file/FileIndex';
import type { PipelineOptions } from './pipeline/PipelineOptions';
import type { MetaEdGrammar } from './grammar/gen/MetaEdGrammar';
import type { MetaEdEnvironment } from './MetaEdEnvironment';
import type { MetaEdPlugin } from './plugin/MetaEdPlugin';

/**
 * The state of MetaEd. Includes the initial configuration, the runtime MetaEd environment, and the results.
 */
export type State = {
  // the project level configuration loaded from the metaed.json file either located at the root level of a project
  // or referenced by the console's --config argument
  metaEdConfiguration: MetaEdConfiguration;

  // the collection of error messages due to an error somewhere in the pipeline e.g. plugin loading
  pipelineFailure: PipelineFailure[];

  // the collection of error messages from syntax and semantic validation, and other processes
  validationFailure: ValidationFailure[];

  // the collection of enhancer results returned by each enhancer
  enhancerResults: EnhancerResult[];

  // the collection of generator results returned by each generator
  generatorResults: GeneratorResult[];

  // the specified directories to load .metaed files from
  inputDirectories: InputDirectory[];
  // file paths to exclude from loading, usually used to allow upstream tasks to provide their own versions in a FileSet
  // e.g. files that are open and unsaved in an editor
  filePathsToExclude: Set<string>;

  // the set of files whose contents have been loaded
  loadedFileSet: FileSet[];

  // the line number indexing for the concatenation of all .metaed files
  fileIndex: FileIndex | null;

  // the ANTLR parse tree of the concatenated .metaed files
  parseTree: MetaEdGrammar | null;

  // the MetaEd environment
  metaEd: MetaEdEnvironment;

  // the directory where metaed outputs artifacts
  outputDirectory: string | null;

  // options for what pipeline steps should run
  pipelineOptions: PipelineOptions;

  // the MetaEd plugins to run, in dependency order
  metaEdPlugins: MetaEdPlugin[];
};

/**
 * Creates a new, empty State object
 */
export const newState: () => State = () => ({
  metaEdConfiguration: newMetaEdConfiguration(),
  pipelineFailure: [],
  validationFailure: [],
  enhancerResults: [],
  generatorResults: [],
  inputDirectories: [],
  filePathsToExclude: new Set(),
  loadedFileSet: [],
  fileIndex: null,
  parseTree: null,
  metaEd: newMetaEdEnvironment(),
  outputDirectory: null,
  metaEdPlugins: [],
  pipelineOptions: newPipelineOptions(),
});
