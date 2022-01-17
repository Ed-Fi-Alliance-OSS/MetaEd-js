import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.namespaceName.toLowerCase() === 'changes') {
      failures.push({
        validatorName: 'NamespaceMustNotBeNamedChanges',
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

  return failures;
}
