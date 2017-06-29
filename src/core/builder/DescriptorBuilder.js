// @flow
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import TopLevelEntityBuilder from './TopLevelEntityBuilder';
import { descriptorFactory } from '../model/Descriptor';
import type { Descriptor, DescriptorSourceMap } from '../model/Descriptor';
import type { EnumerationSourceMap } from '../model/Enumeration';
import type { MapTypeEnumeration } from '../model/MapTypeEnumeration';
import type { EnumerationItem } from '../model/EnumerationItem';
import { mapTypeEnumerationFactory, NoMapTypeEnumeration } from '../model/MapTypeEnumeration';
import { NoEnumerationItem, enumerationItemFactory } from '../model/EnumerationItem';
import { extractDocumentation, extractShortDescription, squareBracketRemoval, isErrorText } from './BuilderUtility';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { ValidationFailure } from '../validator/ValidationFailure';
import { sourceMapFrom } from '../model/SourceMap';

export default class DescriptorBuilder extends TopLevelEntityBuilder {
  currentMapTypeEnumeration: MapTypeEnumeration;
  currentEnumerationItem: EnumerationItem;

  constructor(metaEd: MetaEdEnvironment, validationFailures: Array<ValidationFailure>) {
    super(metaEd, validationFailures);
    this.currentMapTypeEnumeration = NoMapTypeEnumeration;
    this.currentEnumerationItem = NoEnumerationItem;
  }

  enterDescriptor(context: MetaEdGrammar.DescriptorContext) {
    this.enteringEntity(descriptorFactory);
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    ((this.currentTopLevelEntity: any): Descriptor).sourceMap.type = sourceMapFrom(context);
    ((this.currentTopLevelEntity: any): Descriptor).sourceMap.namespaceInfo = this.currentTopLevelEntity.namespaceInfo.sourceMap.type;
  }

  // eslint-disable-next-line no-unused-vars
  exitDescriptor(context: MetaEdGrammar.DescriptorContext) {
    this.exitingEntity();
  }

  enterDescriptorName(context: MetaEdGrammar.DescriptorNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    ((this.currentTopLevelEntity: any): Descriptor).sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterOptionalMapType(context: MetaEdGrammar.OptionalMapTypeContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    ((this.currentTopLevelEntity: any): Descriptor).isMapTypeOptional = true;
    ((this.currentTopLevelEntity.sourceMap: any): DescriptorSourceMap).isMapTypeOptional = sourceMapFrom(context);
  }

  enterRequiredMapType(context: MetaEdGrammar.RequiredMapTypeContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    ((this.currentTopLevelEntity: any): Descriptor).isMapTypeRequired = true;
    ((this.currentTopLevelEntity.sourceMap: any): DescriptorSourceMap).isMapTypeRequired = sourceMapFrom(context);
  }

  enterWithMapType(context: MetaEdGrammar.WithMapTypeContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity || this.namespaceInfo == null) return;
    this.currentMapTypeEnumeration = Object.assign(mapTypeEnumerationFactory(), {
      metaEdName: `${this.currentTopLevelEntity.metaEdName}Map`,
      namespaceInfo: this.namespaceInfo,
    });
    ((this.currentTopLevelEntity.sourceMap: any): DescriptorSourceMap).mapTypeEnumeration = sourceMapFrom(context);

    this.currentMapTypeEnumeration.sourceMap.type = sourceMapFrom(context);
    this.currentMapTypeEnumeration.sourceMap.namespaceInfo = this.currentTopLevelEntity.sourceMap.namespaceInfo;
    ((this.currentMapTypeEnumeration.sourceMap: any): DescriptorSourceMap).mapTypeEnumeration = sourceMapFrom(context);
  }

  enterMapTypeDocumentation(context: MetaEdGrammar.MapTypeDocumentationContext) {
    if (this.currentMapTypeEnumeration === NoMapTypeEnumeration) return;
    this.currentMapTypeEnumeration.documentation = extractDocumentation(context);
    this.currentMapTypeEnumeration.sourceMap.documentation = sourceMapFrom(context);
  }

  enterEnumerationItemDocumentation(context: MetaEdGrammar.EnumerationItemDocumentationContext) {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    this.currentEnumerationItem.documentation = extractDocumentation(context);
    this.currentEnumerationItem.sourceMap.documentation = sourceMapFrom(context);
  }

  // eslint-disable-next-line no-unused-vars
  exitWithMapType(context: MetaEdGrammar.WithMapTypeContext) {
    if (this.currentMapTypeEnumeration === NoMapTypeEnumeration) return;
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      ((this.currentTopLevelEntity: any): Descriptor).mapTypeEnumeration = this.currentMapTypeEnumeration;
    }
    this.entityRepository.mapTypeEnumeration.set(this.currentMapTypeEnumeration.metaEdName, this.currentMapTypeEnumeration);
    this.currentMapTypeEnumeration = NoMapTypeEnumeration;
  }

  enterEnumerationItem(context: MetaEdGrammar.EnumerationItemContext) {
    this.currentEnumerationItem = enumerationItemFactory();
    this.currentEnumerationItem.sourceMap.type = sourceMapFrom(context);
    this.currentEnumerationItem.sourceMap.namespaceInfo = this.currentTopLevelEntity.sourceMap.namespaceInfo;
  }

  exitEnumerationItem(context: MetaEdGrammar.EnumerationItemContext) {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    if (this.currentMapTypeEnumeration !== NoMapTypeEnumeration) {
      this.currentMapTypeEnumeration.enumerationItems.push(this.currentEnumerationItem);
      ((this.currentMapTypeEnumeration.sourceMap: any): EnumerationSourceMap).enumerationItems.push(sourceMapFrom(context));
    }
    this.currentEnumerationItem = NoEnumerationItem;
  }

  enterMetaEdId(context: MetaEdGrammar.MetaEdIdContext) {
    if (context.exception || context.METAED_ID() == null || context.METAED_ID().exception != null || isErrorText(context.METAED_ID().getText())) return;
    if (this.currentEnumerationItem !== NoEnumerationItem) {
      this.currentEnumerationItem.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentEnumerationItem.sourceMap.metaEdId = sourceMapFrom(context);
    } else {
      super.enterMetaEdId(context);
    }
  }

  enterShortDescription(context: MetaEdGrammar.ShortDescriptionContext) {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    this.currentEnumerationItem.shortDescription = extractShortDescription(context);
    this.currentEnumerationItem.sourceMap.shortDescription = sourceMapFrom(context);
  }
}
