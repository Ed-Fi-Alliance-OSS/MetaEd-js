import type { ParseTree } from 'antlr4';
import { newMetaEdConfiguration } from './MetaEdConfiguration';
import { newMetaEdEnvironment } from './MetaEdEnvironment';
import { newPipelineOptions } from './pipeline/PipelineOptions';
import { MetaEdConfiguration } from './MetaEdConfiguration';
import { ValidationFailure } from './validator/ValidationFailure';
import { PipelineFailure } from './pipeline/PipelineFailure';
import { EnhancerResult } from './enhancer/EnhancerResult';
import { GeneratorResult } from './generator/GeneratorResult';
import { InputDirectory } from './file/InputDirectory';
import { FileSet } from './file/MetaEdFile';
import { FileIndex } from './file/FileIndex';
import { PipelineOptions } from './pipeline/PipelineOptions';
import { MetaEdEnvironment } from './MetaEdEnvironment';
import { PluginManifest } from './plugin/PluginManifest';

/**
 *
 */
export interface State {
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
  parseTree: ParseTree | null;

  // the MetaEd environment
  metaEd: MetaEdEnvironment;

  // the directory where metaed outputs artifacts
  outputDirectory: string | null;

  // the directory to scan for plugins
  pluginScanDirectory: string | null;

  // the plugin manifest information loaded from each plugin's package.json
  pluginManifest: PluginManifest[];

  // options for what pipeline steps should run
  pipelineOptions: PipelineOptions;
}

/**
 *
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
  pluginScanDirectory: null,
  pluginManifest: [],
  pluginConfiguration: new Map(),
  pipelineOptions: newPipelineOptions(),
});
