import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newAssociationExtension } from '../model/AssociationExtension';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates AssociationExtension entities.
 */
export class AssociationExtensionBuilder extends TopLevelEntityBuilder {
  enterAssociationExtension(context: MetaEdGrammar.AssociationExtensionContext) {
    this.enteringEntity(newAssociationExtension);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  exitAssociationExtension(_context: MetaEdGrammar.AssociationExtensionContext) {
    this.exitingEntity();
  }

  enterExtendeeName(context: MetaEdGrammar.ExtendeeNameContext) {
    this.enteringExtendeeName(context);
  }
}
