import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newCommonExtension } from '../model/CommonExtension';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates CommonExtension entities.
 */
export class CommonExtensionBuilder extends TopLevelEntityBuilder {
  enterCommonExtension(context: MetaEdGrammar.CommonExtensionContext) {
    this.enteringEntity(newCommonExtension);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  exitCommonExtension(_context: MetaEdGrammar.CommonExtensionContext) {
    this.exitingEntity();
  }

  enterExtendeeName(context: MetaEdGrammar.ExtendeeNameContext) {
    this.enteringExtendeeName(context);
  }
}
