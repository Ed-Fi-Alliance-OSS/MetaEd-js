// @flow
import { MetaEdContext } from './MetaEdContext';

export interface ITask {
  name: string,
  prerequisite: any,
  executeTask(context: MetaEdContext): boolean
}
