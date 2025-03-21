// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newDescriptor, asDescriptor } from '../model/Descriptor';
import { DescriptorSourceMap } from '../model/Descriptor';
import { EnumerationSourceMap } from '../model/Enumeration';
import { MapTypeEnumeration } from '../model/MapTypeEnumeration';
import { EnumerationItem } from '../model/EnumerationItem';
import { newMapTypeEnumeration, NoMapTypeEnumeration } from '../model/MapTypeEnumeration';
import { NoEnumerationItem, newEnumerationItem } from '../model/EnumerationItem';
import { extractDocumentation, extractShortDescription, isErrorText } from './BuilderUtility';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { ValidationFailure } from '../validator/ValidationFailure';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates Descriptor entities.
 */
export class DescriptorBuilder extends TopLevelEntityBuilder {
  currentMapTypeEnumeration: MapTypeEnumeration;

  currentEnumerationItem: EnumerationItem;

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super(metaEd, validationFailures);
    this.currentMapTypeEnumeration = NoMapTypeEnumeration;
    this.currentEnumerationItem = NoEnumerationItem;
  }

  enterDescriptor(context: MetaEdGrammar.DescriptorContext) {
    this.enteringEntity(newDescriptor);
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
  }

  exitDescriptor(_context: MetaEdGrammar.DescriptorContext) {
    this.exitingEntity();
  }

  enterDescriptorName(context: MetaEdGrammar.DescriptorNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterOptionalMapType(context: MetaEdGrammar.OptionalMapTypeContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    asDescriptor(this.currentTopLevelEntity).isMapTypeOptional = true;
    (this.currentTopLevelEntity.sourceMap as DescriptorSourceMap).isMapTypeOptional = sourceMapFrom(context);
  }

  enterRequiredMapType(context: MetaEdGrammar.RequiredMapTypeContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    asDescriptor(this.currentTopLevelEntity).isMapTypeRequired = true;
    (this.currentTopLevelEntity.sourceMap as DescriptorSourceMap).isMapTypeRequired = sourceMapFrom(context);
  }

  enterWithMapType(context: MetaEdGrammar.WithMapTypeContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    this.currentMapTypeEnumeration = {
      ...newMapTypeEnumeration(),
      metaEdName: `${this.currentTopLevelEntity.metaEdName}Map`,
      namespace: this.currentTopLevelEntity.namespace,
    };
    (this.currentTopLevelEntity.sourceMap as DescriptorSourceMap).mapTypeEnumeration = sourceMapFrom(context);

    this.currentMapTypeEnumeration.sourceMap.type = sourceMapFrom(context);
    (this.currentMapTypeEnumeration.sourceMap as unknown as DescriptorSourceMap).mapTypeEnumeration = sourceMapFrom(context);
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

  exitWithMapType(_context: MetaEdGrammar.WithMapTypeContext) {
    if (this.currentMapTypeEnumeration === NoMapTypeEnumeration) return;
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      asDescriptor(this.currentTopLevelEntity).mapTypeEnumeration = this.currentMapTypeEnumeration;
    }
    this.currentNamespace.entity.mapTypeEnumeration.set(
      this.currentMapTypeEnumeration.metaEdName,
      this.currentMapTypeEnumeration,
    );
    this.currentMapTypeEnumeration = NoMapTypeEnumeration;
  }

  enterEnumerationItem(context: MetaEdGrammar.EnumerationItemContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    this.currentEnumerationItem = newEnumerationItem();
    this.currentEnumerationItem.sourceMap.type = sourceMapFrom(context);
  }

  exitEnumerationItem(context: MetaEdGrammar.EnumerationItemContext) {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    if (this.currentMapTypeEnumeration !== NoMapTypeEnumeration) {
      this.currentMapTypeEnumeration.enumerationItems.push(this.currentEnumerationItem);
      (this.currentMapTypeEnumeration.sourceMap as EnumerationSourceMap).enumerationItems.push(sourceMapFrom(context));
    }
    this.currentEnumerationItem = NoEnumerationItem;
  }

  enterShortDescription(context: MetaEdGrammar.ShortDescriptionContext) {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    this.currentEnumerationItem.shortDescription = extractShortDescription(context);
    this.currentEnumerationItem.sourceMap.shortDescription = sourceMapFrom(context);
  }
}
