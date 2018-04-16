'use babel';

import OutputWindow from '../lib/OutputWindow';

describe('OutputWindow', () => {
  let outputWindow;
  let testPanel;

  beforeEach(() => {
    outputWindow = new OutputWindow();
    testPanel = jasmine.createSpyObj('TestPanel', ['add', 'attach', 'clear', 'close', 'toggle', 'updateScroll']);
    testPanel.body = jasmine.createSpyObj('body', ['css']);
    testPanel.btnFold = jasmine.createSpyObj('btnFold', ['hasClass']);
  });

  describe('.addMessage()', () => {
    it('adds message with no raw indicator', () => {
      outputWindow._outputWindow = testPanel;
      spyOn(outputWindow, 'ensureOutputWindowIsVisible');
      const message = 'Test Message';
      outputWindow.addMessage(message);

      expect(outputWindow.ensureOutputWindowIsVisible).toHaveBeenCalled();
      // Old style Jasmine syntax using calls and args instead of jasmine.objectContaining
      // because Atom is stuck on Jasmine 1.3 that doesn't support it
      expect(testPanel.add.calls[0].args[0].message).toEqual(message);
      expect(testPanel.add.calls[0].args[0].raw).toEqual(false);
      expect(testPanel.updateScroll).toHaveBeenCalled();
    });

    it('adds message with raw indicator', () => {
      outputWindow._outputWindow = testPanel;
      spyOn(outputWindow, 'ensureOutputWindowIsVisible');
      const message = 'Test Message';
      outputWindow.addMessage(message, true);

      expect(outputWindow.ensureOutputWindowIsVisible).toHaveBeenCalled();
      expect(testPanel.add).toHaveBeenCalled();
      // Old style Jasmine syntax using calls and args instead of jasmine.objectContaining
      // because Atom is stuck on Jasmine 1.3 that doesn't support it
      expect(testPanel.add.calls[0].args[0].message).toEqual(message);
      expect(testPanel.add.calls[0].args[0].raw).toEqual(true);
      expect(testPanel.updateScroll).toHaveBeenCalled();
    });
  });

  describe('.clear()', () => {
    it('clear does not throw if window has not been initialized', () => {
      outputWindow._outputWindow = undefined;
      // Should not throw an exception for an undefined outputWindow
      outputWindow.clear();
    });

    it('clears the window if window has been initialized', () => {
      outputWindow._outputWindow = testPanel;
      outputWindow.clear();

      expect(testPanel.clear).toHaveBeenCalled();
    });
  });

  describe('.ensureOutputWindowIsVisible()', () => {
    it('initializes window if has not been initialized', () => {
      outputWindow.ensureOutputWindowIsVisible();

      expect(outputWindow._outputWindow).not.toBeUndefined();
      expect(outputWindow._outputWindow.title).toEqual('MetaEd');
      expect(outputWindow._outputWindow.autoScroll).toEqual(true);
    });

    it('skips window initialization if has been already initialized and is expanded', () => {
      testPanel.btnFold.hasClass.andReturn(false);
      outputWindow._outputWindow = testPanel;
      outputWindow.ensureOutputWindowIsVisible();

      expect(testPanel.body.css).not.toHaveBeenCalled();
      expect(testPanel.attach).toHaveBeenCalled();
      expect(testPanel.toggle).not.toHaveBeenCalled();
    });

    it('toggles window if has been already initialized and is collapsed', () => {
      testPanel.btnFold.hasClass.andReturn(true);
      outputWindow._outputWindow = testPanel;
      outputWindow.ensureOutputWindowIsVisible();

      expect(testPanel.body.css).not.toHaveBeenCalled();
      expect(testPanel.attach).toHaveBeenCalled();
      expect(testPanel.toggle).toHaveBeenCalled();
    });
  });

  describe('.dispose()', () => {
    it('dispose does not throw if window has not been initialized', () => {
      outputWindow._outputWindow = undefined;
      // Should not throw an exception for an undefined outputWindow
      outputWindow.dispose();
    });

    it('closes the window if window has been initialized', () => {
      outputWindow._outputWindow = testPanel;
      outputWindow.dispose();

      expect(testPanel.close).toHaveBeenCalled();
    });
  });
});
