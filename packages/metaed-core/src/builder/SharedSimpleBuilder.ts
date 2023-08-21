import { SharedSimple } from '../model/SharedSimple';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';
import { ValidationFailure } from '../validator/ValidationFailure';
import { NoSharedSimple } from '../model/SharedSimple';
import { namespaceNameFrom } from './NamespaceBuilder';
import { extractDocumentation, extractDeprecationReason } from './BuilderUtility';
import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import { sourceMapFrom } from '../model/SourceMap';
import { NoNamespace } from '../model/Namespace';

/**
 * An ANTLR4 listener that creates SharedSimple entities.
 */
export class SharedSimpleBuilder extends MetaEdGrammarListener {
  currentSharedSimple: SharedSimple;

  metaEd: MetaEdEnvironment;

  currentNamespace: Namespace;

  validationFailures: ValidationFailure[];

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super();
    this.metaEd = metaEd;
    this.validationFailures = validationFailures;
    this.currentNamespace = NoNamespace;
    this.currentSharedSimple = NoSharedSimple;
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    const namespace: Namespace | undefined = this.metaEd.namespace.get(namespaceNameFrom(context));
    this.currentNamespace = namespace == null ? NoNamespace : namespace;
  }

  enteringSharedSimple(simpleFactory: () => SharedSimple) {
    this.currentSharedSimple = { ...simpleFactory(), namespace: this.currentNamespace };
  }

  exitingSharedSimple() {
    if (this.currentSharedSimple === NoSharedSimple) return;

    if (this.currentSharedSimple.metaEdName) {
      const currentSharedSimpleRepository: Map<string, SharedSimple> =
        this.currentNamespace.entity[this.currentSharedSimple.type];
      if (currentSharedSimpleRepository.has(this.currentSharedSimple.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'SharedSimpleBuilder',
          category: 'error',
          message: `${this.currentSharedSimple.typeHumanizedName} named ${this.currentSharedSimple.metaEdName} is a duplicate declaration of that name.`,
          sourceMap: this.currentSharedSimple.sourceMap.metaEdName,
          fileMap: null,
        });
        const duplicateEntity: SharedSimple | undefined = currentSharedSimpleRepository.get(
          this.currentSharedSimple.metaEdName,
        );
        if (duplicateEntity != null) {
          this.validationFailures.push({
            validatorName: 'SharedSimpleBuilder',
            category: 'error',
            message: `${duplicateEntity.typeHumanizedName} named ${duplicateEntity.metaEdName} is a duplicate declaration of that name.`,
            sourceMap: duplicateEntity.sourceMap.metaEdName,
            fileMap: null,
          });
        }
      } else {
        currentSharedSimpleRepository.set(this.currentSharedSimple.metaEdName, this.currentSharedSimple);
      }
    }
    this.currentSharedSimple = NoSharedSimple;
  }

  enteringName(name: string) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    this.currentSharedSimple.metaEdName = name;
  }

  enterDocumentation(context: MetaEdGrammar.DocumentationContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    this.currentSharedSimple.documentation = extractDocumentation(context);
    this.currentSharedSimple.sourceMap.documentation = sourceMapFrom(context);
  }

  enterDeprecated(context: MetaEdGrammar.DeprecatedContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;

    if (!context.exception) {
      this.currentSharedSimple.isDeprecated = true;
      this.currentSharedSimple.deprecationReason = extractDeprecationReason(context);
      this.currentSharedSimple.sourceMap.isDeprecated = sourceMapFrom(context);
      this.currentSharedSimple.sourceMap.deprecationReason = sourceMapFrom(context);
    }
  }
}
