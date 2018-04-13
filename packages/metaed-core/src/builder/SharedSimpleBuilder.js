// @flow
import type { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';

import type { SharedSimple } from '../model/SharedSimple';
import type { EntityRepository } from '../model/EntityRepository';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { NamespaceInfo } from '../model/NamespaceInfo';

import { NoSharedSimple } from '../model/SharedSimple';
import { namespaceName } from './NamespaceInfoBuilder';
import { extractDocumentation, isErrorText, squareBracketRemoval } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';

import type { ValidationFailure } from '../validator/ValidationFailure';

export class SharedSimpleBuilder extends MetaEdGrammarListener {
  entityRepository: EntityRepository;
  currentNamespace: string;
  currentSharedSimple: SharedSimple;
  validationFailures: Array<ValidationFailure>;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super();
    this.entityRepository = metaEd.entity;
    this.currentNamespace = '';
    this.currentSharedSimple = NoSharedSimple;
    this.validationFailures = validationFailures;
  }

  getNamespaceInfo(): ?NamespaceInfo {
    return this.entityRepository.namespaceInfo.get(this.currentNamespace);
  }

  enterNamespaceName(context: MetaEdGrammar.NamespaceNameContext) {
    this.currentNamespace = namespaceName(context);
  }

  enteringSharedSimple(simpleFactory: () => SharedSimple) {
    const namespaceInfo = this.getNamespaceInfo();
    if (namespaceInfo == null) return;
    this.currentSharedSimple = { ...simpleFactory(), namespaceInfo };
  }

  exitingSharedSimple() {
    if (this.currentSharedSimple === NoSharedSimple) return;

    if (this.currentSharedSimple.metaEdName) {
      // $FlowIgnore - allowing currentSharedSimple.type to specify the entityRepository Map property
      const currentSharedSimpleRepository = this.entityRepository[this.currentSharedSimple.type];
      if (currentSharedSimpleRepository.has(this.currentSharedSimple.metaEdName)) {
        this.validationFailures.push({
          validatorName: 'SharedSimpleBuilder',
          category: 'error',
          message: `${this.currentSharedSimple.typeHumanizedName} named ${
            this.currentSharedSimple.metaEdName
          } is a duplicate declaration of that name.`,
          sourceMap: this.currentSharedSimple.sourceMap.type,
          fileMap: null,
        });
        const duplicateEntity: SharedSimple = currentSharedSimpleRepository.get(this.currentSharedSimple.metaEdName);
        this.validationFailures.push({
          validatorName: 'SharedSimpleBuilder',
          category: 'error',
          message: `${duplicateEntity.typeHumanizedName} named ${
            duplicateEntity.metaEdName
          } is a duplicate declaration of that name.`,
          sourceMap: duplicateEntity.sourceMap.type,
          fileMap: null,
        });
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

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (
      context.exception ||
      context.METAED_ID() == null ||
      context.METAED_ID().exception != null ||
      isErrorText(context.METAED_ID().getText())
    )
      return;
    if (this.currentSharedSimple !== NoSharedSimple) {
      this.currentSharedSimple.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentSharedSimple.sourceMap.metaEdId = sourceMapFrom(context);
    }
  }
}
