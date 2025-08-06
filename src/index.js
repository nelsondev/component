/**
 * Tron Component Library
 * Ultra-simple reactive web component library
 * @author Nelson M
 * @license MIT
 */
import { createComponent } from './core/component.js';

export function component(tagName, definition) {
  return createComponent(tagName, definition);
}

// Global registration for script tag usage
if (typeof window !== 'undefined') {
  window.component = component;
  window.TronComponent = { component };
}