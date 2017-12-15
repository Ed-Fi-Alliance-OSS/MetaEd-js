
// @flow
import { newTrigger, insertUpdateDelete } from '../../../src/model/database/Trigger';
import type { Trigger } from '../../../src/model/database/Trigger';

describe('when getting all trigger events', () => {
  let trigger: Trigger;

  beforeAll(() => {
    trigger = Object.assign(newTrigger(), {
      name: 'TriggerName',
      onInsert: true,
      onUpdate: true,
      onDelete: true,
    });
  });

  it('should return an array of events', () => {
    expect(insertUpdateDelete(trigger)).toEqual(['INSERT', 'UPDATE', 'DELETE']);
  });
});

describe('when getting on update trigger event', () => {
  let trigger: Trigger;

  beforeAll(() => {
    trigger = Object.assign(newTrigger(), {
      name: 'TriggerName',
      onUpdate: true,
    });
  });

  it('should return an array of events', () => {
    expect(insertUpdateDelete(trigger)).toEqual(['UPDATE']);
  });
});

describe('when getting no trigger event', () => {
  let trigger: Trigger;

  beforeAll(() => {
    trigger = Object.assign(newTrigger(), {
      name: 'TriggerName',
    });
  });

  it('should return an empty array', () => {
    expect(insertUpdateDelete(trigger)).toHaveLength(0);
  });
});
