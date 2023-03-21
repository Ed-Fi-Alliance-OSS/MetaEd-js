import type {
  EnumerationContext,
  EnumerationItemContext,
  EnumerationItemDocumentationContext,
  EnumerationNameContext,
  MetaEdIdContext,
  ShortDescriptionContext,
} from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newEnumeration, asEnumeration } from '../model/Enumeration';
import { newSchoolYearEnumeration } from '../model/SchoolYearEnumeration';
import { EnumerationSourceMap } from '../model/Enumeration';
import { EnumerationItem } from '../model/EnumerationItem';
import { newEnumerationItem, NoEnumerationItem } from '../model/EnumerationItem';
import { extractDocumentation, extractShortDescription, squareBracketRemoval, isErrorText } from './BuilderUtility';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { ValidationFailure } from '../validator/ValidationFailure';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates Enumeration entities.
 */
export class EnumerationBuilder extends TopLevelEntityBuilder {
  currentEnumerationItem: EnumerationItem;

  constructor(metaEd: MetaEdEnvironment, validationFailures: ValidationFailure[]) {
    super(metaEd, validationFailures);
    this.currentEnumerationItem = NoEnumerationItem;
  }

  enterEnumeration = (context: EnumerationContext) => {
    this.enteringEntity(newEnumeration);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      Object.assign(this.currentTopLevelEntity.sourceMap, {
        type: sourceMapFrom(context),
      });
    }
  };

  exitEnumeration = (_context: EnumerationContext) => {
    this.exitingEntity();
  };

  enterEnumerationName = (context: EnumerationNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    const enumerationName = context.ID().getText();

    // need to differentiate SchoolYear from other enumerations - overwrite with new type
    if (enumerationName === 'SchoolYear') {
      this.enteringEntity(newSchoolYearEnumeration);
      Object.assign(this.currentTopLevelEntity.sourceMap, {
        type: sourceMapFrom(context),
      });
    }

    this.enteringName(enumerationName);
    Object.assign(this.currentTopLevelEntity.sourceMap, {
      metaEdName: sourceMapFrom(context),
    });
  };

  enterEnumerationItemDocumentation = (context: EnumerationItemDocumentationContext) => {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    this.currentEnumerationItem.documentation = extractDocumentation(context);
    this.currentEnumerationItem.sourceMap.documentation = sourceMapFrom(context);
  };

  enterEnumerationItem = (context: EnumerationItemContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    this.currentEnumerationItem = newEnumerationItem();
    this.currentEnumerationItem.sourceMap.type = sourceMapFrom(context);
  };

  exitEnumerationItem = (context: EnumerationItemContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity || this.currentEnumerationItem === NoEnumerationItem) return;
    asEnumeration(this.currentTopLevelEntity).enumerationItems.push(this.currentEnumerationItem);
    (this.currentTopLevelEntity.sourceMap as EnumerationSourceMap).enumerationItems.push(sourceMapFrom(context));
    this.currentEnumerationItem = NoEnumerationItem;
  };

  enterMetaEdId = (context: MetaEdIdContext) => {
    if (context.exception || context.METAED_ID() == null || isErrorText(context.METAED_ID().getText())) return;
    if (this.currentEnumerationItem !== NoEnumerationItem) {
      this.currentEnumerationItem.metaEdId = squareBracketRemoval(context.METAED_ID().getText());
      this.currentEnumerationItem.sourceMap.metaEdId = sourceMapFrom(context);
    } else {
      super.enterMetaEdId(context);
    }
  };

  enterShortDescription = (context: ShortDescriptionContext) => {
    if (this.currentEnumerationItem === NoEnumerationItem) return;
    this.currentEnumerationItem.shortDescription = extractShortDescription(context);
    this.currentEnumerationItem.sourceMap.shortDescription = sourceMapFrom(context);
  };
}
