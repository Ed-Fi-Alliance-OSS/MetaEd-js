import type { AssociationExtensionContext, ExtendeeNameContext } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newAssociationExtension } from '../model/AssociationExtension';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates AssociationExtension entities.
 */
export class AssociationExtensionBuilder extends TopLevelEntityBuilder {
  enterAssociationExtension = (context: AssociationExtensionContext) => {
    this.enteringEntity(newAssociationExtension);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitAssociationExtension = (_context: AssociationExtensionContext) => {
    this.exitingEntity();
  };

  enterExtendeeName = (context: ExtendeeNameContext) => {
    this.enteringExtendeeName(context);
  };
}
