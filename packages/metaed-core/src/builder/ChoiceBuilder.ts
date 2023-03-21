import type { ChoiceContext, ChoiceNameContext } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newChoice } from '../model/Choice';
import { isErrorText } from './BuilderUtility';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates Choice entities.
 */
export class ChoiceBuilder extends TopLevelEntityBuilder {
  enterChoice = (context: ChoiceContext) => {
    this.enteringEntity(newChoice);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitChoice = (_context: ChoiceContext) => {
    this.exitingEntity();
  };

  enterChoiceName = (context: ChoiceNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };
}
