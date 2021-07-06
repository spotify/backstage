/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { act, fireEvent } from '@testing-library/react';

const codes = {
  Tab: 9,
  Enter: 10,
  Click: 17 /* This keyboard can click, deal with it */,
  Esc: 27,
};

export class Keyboard {
  static async type(target, input) {
    await new Keyboard(target).type(input);
  }

  static async typeDebug(target, input) {
    await new Keyboard(target, { debug: true }).type(input);
  }

  static toReadableInput(chars) {
    return chars.split('').map(char => {
      switch (char.charCodeAt(0)) {
        case codes.Tab:
          return '<Tab>';
        case codes.Enter:
          return '<Enter>';
        case codes.Click:
          return '<Click>';
        case codes.Esc:
          return '<Esc>';
        default:
          return char;
      }
    });
  }

  static fromReadableInput(input) {
    return input.trim().replace(/\s*<([a-zA-Z]+)>\s*/g, (match, name) => {
      if (name in codes) {
        return String.fromCharCode(codes[name]);
      }
      throw new Error(`Unknown char name: '${name}'`);
    });
  }

  constructor(target, { debug = false } = {}) {
    this.debug = debug;

    if (target.ownerDocument) {
      this.document = target.ownerDocument;
    } else if (target.baseElement) {
      this.document = target.baseElement.ownerDocument;
    } else {
      throw new TypeError(
        'Keyboard(target): target must be DOM node or react-testing-library render() output',
      );
    }
  }

  toString() {
    return `Keyboard{document=${this.document}, debug=${this.debug}}`;
  }

  _log(message, ...args) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log(`[Keyboard] ${message}`, ...args);
    }
  }

  _pretty(element) {
    const attrs = [...element.attributes]
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ');
    return `<${element.nodeName.toLowerCase()} ${attrs}>`;
  }

  get focused() {
    return this.document.activeElement;
  }

  async type(input) {
    this._log(
      `sending sequence '${input}' with initial focus ${this._pretty(
        this.focused,
      )}`,
    );
    await this.send(Keyboard.fromReadableInput(input));
  }

  async send(chars) {
    for (const key of chars.split('')) {
      const charCode = key.charCodeAt(0);

      if (charCode === codes.Tab) {
        await this.tab();
        continue;
      }

      const focused = this.focused;
      if (!focused || focused === this.document.body) {
        throw Error(
          `No element focused in document while trying to type '${Keyboard.toReadableInput(
            chars,
          )}'`,
        );
      }
      const nextValue = (focused.value || '') + key;

      if (charCode >= 32) {
        await this._sendKey(key, charCode, () => {
          this._log(
            `sending +${key} = '${nextValue}' to ${this._pretty(focused)}`,
          );
          fireEvent.change(focused, {
            target: { value: nextValue },
            bubbles: true,
            cancelable: true,
          });
        });
      } else if (charCode === codes.Enter) {
        await this.enter(focused.value || '');
      } else if (charCode === codes.Esc) {
        await this.escape();
      } else if (charCode === codes.Click) {
        await this.click();
      } else {
        throw new Error(`Unsupported char code, ${charCode}`);
      }
    }
  }

  async click() {
    this._log(`clicking ${this._pretty(this.focused)}`);
    await act(async () => fireEvent.click(this.focused));
  }

  async tab() {
    await this._sendKey('Tab', codes.Tab, () => {
      const focusable = this.document.querySelectorAll(
        [
          'a[href]',
          'area[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          'button:not([disabled])',
          'iframe',
          'object',
          'embed',
          '*[tabindex]',
          '*[contenteditable]',
        ].join(','),
      );

      const tabbable = [...focusable].filter(el => {
        return el.tabIndex >= 0;
      });

      const focused = this.document.activeElement;
      const focusedIndex = tabbable.indexOf(focused);
      const nextFocus = tabbable[focusedIndex + (1 % tabbable.length)];

      this._log(
        `tabbing to ${this._pretty(nextFocus)} ${this.focused.textContent}`,
      );
      nextFocus.focus();
    });
  }

  async enter(value) {
    this._log(`submitting '${value}' via ${this._pretty(this.focused)}`);
    await act(() =>
      this._sendKey('Enter', codes.Enter, () => {
        if (this.focused.type === 'button') {
          fireEvent.click(this.focused, { target: { value } });
        } else {
          fireEvent.submit(this.focused, {
            target: { value },
            bubbles: true,
            cancelable: true,
          });
        }
      }),
    );
  }

  async escape() {
    this._log(`escape from ${this._pretty(this.focused)}`);
    await act(async () => this._sendKey('Escape', codes.Esc));
  }

  async _sendKey(key, charCode, action) {
    const event = { key, charCode, keyCode: charCode, which: charCode };
    const focused = this.focused;

    if (fireEvent.keyDown(focused, event)) {
      if (fireEvent.keyPress(focused, event)) {
        if (action) {
          action();
        }
      }
    }
    fireEvent.keyUp(focused, event);
  }
}
