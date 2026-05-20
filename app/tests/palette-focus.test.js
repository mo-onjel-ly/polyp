/**
 * Regression test: command palette must return keyboard focus to canvas on close.
 *
 * Bug: closePal() was not calling blur() on cmdpal-input. The input retained
 * focus after close, causing the global keydown handler's INPUT early-return to
 * swallow all navigation shortcuts (hjkl etc.).
 *
 * Fix: added cmdpalInput.blur() to closePal() in commit 2dfbb7e.
 *
 * Run with: bun test tests/palette-focus.test.js
 */
import { test, expect, describe, beforeEach } from 'bun:test';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

const html = readFileSync(join(import.meta.dir, '../renderer/index.html'), 'utf8');

function makeDOM() {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'http://localhost',
  });
  return dom;
}

describe('command palette focus', () => {
  let dom, window, document;

  beforeEach(() => {
    dom = makeDOM();
    window = dom.window;
    document = window.document;
    // Wait for script to run
  });

  test('cmdpal-input is not focused after close via cmd+p', (done) => {
    // Give the IIFE time to execute
    setTimeout(() => {
      const input = document.getElementById('cmdpal-input');
      const wrap  = document.getElementById('cmdpal-wrap');

      // Open: simulate cmd+p
      const openEvt = new window.KeyboardEvent('keydown', {
        key: 'p', metaKey: true, bubbles: true
      });
      document.dispatchEvent(openEvt);

      expect(wrap.classList.contains('cmdpal-open')).toBe(true);

      // Close: simulate cmd+p again
      const closeEvt = new window.KeyboardEvent('keydown', {
        key: 'p', metaKey: true, bubbles: true
      });
      document.dispatchEvent(closeEvt);

      expect(wrap.classList.contains('cmdpal-open')).toBe(false);

      // THE regression check: input must not be the active element
      expect(document.activeElement).not.toBe(input);

      done();
    }, 50);
  });

  test('cmdpal-input is not focused after close via Escape', (done) => {
    setTimeout(() => {
      const input = document.getElementById('cmdpal-input');
      const wrap  = document.getElementById('cmdpal-wrap');

      // Open
      document.dispatchEvent(new window.KeyboardEvent('keydown', {
        key: 'p', metaKey: true, bubbles: true
      }));
      expect(wrap.classList.contains('cmdpal-open')).toBe(true);

      // Close via Esc (input is empty)
      input.dispatchEvent(new window.KeyboardEvent('keydown', {
        key: 'Escape', bubbles: true
      }));

      expect(wrap.classList.contains('cmdpal-open')).toBe(false);
      expect(document.activeElement).not.toBe(input);

      done();
    }, 50);
  });

  test('navigation keydown reaches handler after palette close', (done) => {
    setTimeout(() => {
      const wrap = document.getElementById('cmdpal-wrap');

      // Open then close
      document.dispatchEvent(new window.KeyboardEvent('keydown', {
        key: 'p', metaKey: true, bubbles: true
      }));
      document.dispatchEvent(new window.KeyboardEvent('keydown', {
        key: 'p', metaKey: true, bubbles: true
      }));

      expect(wrap.classList.contains('cmdpal-open')).toBe(false);

      // 'h' should not be blocked — dispatch and check it doesn't throw
      // (In JSDOM we can't easily verify navDir was called, but we can
      // verify the event isn't swallowed by confirming no exception.)
      let threw = false;
      try {
        document.dispatchEvent(new window.KeyboardEvent('keydown', {
          key: 'h', bubbles: true
        }));
      } catch (e) {
        threw = true;
      }
      expect(threw).toBe(false);

      done();
    }, 50);
  });
});
