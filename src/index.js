/**
 * Tron Component Library
 * Ultra-simple reactive web component library
 * @author Nelson M
 * @license MIT
 */

import { createComponent } from './core/component.js';
import { StyleManager } from './styling/manager.js';

const styleManager = new StyleManager();

export async function init(options = {}) {
  await styleManager.init(options);
  return { component, init };
}

export function component(tagName, definition) {
  return createComponent(tagName, definition);
}

// Global registration for script tag usage
if (typeof window !== 'undefined') {
  window.component = component;
  window.TronComponent = { component, init };
}