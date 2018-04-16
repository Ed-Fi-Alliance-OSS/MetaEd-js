/** @babel */
// @flow

import { MessagePanelView, PlainMessageView } from 'atom-message-panel';

export default class OutputWindow {
  _outputWindow: MessagePanelView;

  constructor() {
    this._outputWindow = null;
  }

  addMessage(message: string, raw: boolean = false) {
    this.ensureOutputWindowIsVisible();
    this._outputWindow.add(new PlainMessageView({ message, raw }));
    this._outputWindow.updateScroll();
  }

  clear() {
    if (this._outputWindow) {
      this._outputWindow.clear();
    }
  }

  ensureOutputWindowIsVisible() {
    if (!this._outputWindow) {
      const explicitSize = '170px';
      this._outputWindow = new MessagePanelView({
        title: 'MetaEd',
        autoScroll: true,
        maxHeight: explicitSize,
      });
      this._outputWindow.body.css({
        minHeight: explicitSize,
      });
    }
    this._outputWindow.attach();
    if (this._outputWindow.btnFold.hasClass('icon-unfold')) {
      this._outputWindow.toggle();
    }
  }

  dispose() {
    if (this._outputWindow) {
      this._outputWindow.close();
      this._outputWindow = null;
    }
  }
}
