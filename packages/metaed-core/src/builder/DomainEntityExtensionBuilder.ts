import type { DomainEntityExtensionContext, ExtendeeNameContext } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newDomainEntityExtension } from '../model/DomainEntityExtension';
import { sourceMapFrom } from '../model/SourceMap';
import { NoTopLevelEntity } from '../model/TopLevelEntity';

/**
 * An ANTLR4 listener that creates DomainEntityExtension entities.
 */
export class DomainEntityExtensionBuilder extends TopLevelEntityBuilder {
  enterDomainEntityExtension = (context: DomainEntityExtensionContext) => {
    this.enteringEntity(newDomainEntityExtension);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitDomainEntityExtension = (_context: DomainEntityExtensionContext) => {
    this.exitingEntity();
  };

  enterExtendeeName = (context: ExtendeeNameContext) => {
    this.enteringExtendeeName(context);
  };
}
