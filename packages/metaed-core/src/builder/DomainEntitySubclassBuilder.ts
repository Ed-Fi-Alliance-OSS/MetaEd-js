import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newDomainEntitySubclass } from '../model/DomainEntitySubclass';
import { sourceMapFrom } from '../model/SourceMap';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';

/**
 * An ANTLR4 listener that creates DomainEntitySubclass entities.
 */
export class DomainEntitySubclassBuilder extends TopLevelEntityBuilder {
  enterDomainEntitySubclass(context: MetaEdGrammar.DomainEntitySubclassContext) {
    this.enteringEntity(newDomainEntitySubclass);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      Object.assign(this.currentTopLevelEntity.sourceMap, {
        type: sourceMapFrom(context),
      });
    }
  }

  exitDomainEntitySubclass(_context: MetaEdGrammar.DomainEntitySubclassContext) {
    this.exitingEntity();
  }

  enterEntityName(context: MetaEdGrammar.DomainEntityNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterBaseName(context: MetaEdGrammar.BaseNameContext) {
    this.enteringBaseName(context);
  }
}
