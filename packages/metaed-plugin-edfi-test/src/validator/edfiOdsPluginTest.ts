import { MetaEdEnvironment, ValidationFailure, Namespace, Logger } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  Logger.info('Plugin Test validation.');
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.namespaceName.toLowerCase() === 'changes') {
      failures.push({
        validatorName: 'PluginTest',
        category: 'error',
        message: `The "Changes" project name is reserved by the ODS/API Change Event feature.  Choose a different project name or disable the feature.`,
        // validation of a project/namespace name doesn't really fit with our source map scheme
        sourceMap: {
          line: 0,
          column: 0,
          tokenText: '',
        },
        fileMap: null,
      });
    }
  });

  if (failures.length === 0) Logger.info('Plugin Test validation -> Success.');
  else Logger.info('Plugin Test validation -> Error.');

  return failures;
}
