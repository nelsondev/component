/**
 * Tron Component Library
 * Ultra-simple reactive web component library
 * @author Nelson M
 * @license MIT
 */
import { createComponent, use } from './core/component.js';

export function component(tagName, definition) {
  return createComponent(tagName, definition);
}

export { use };

// Global registration for script tag usage
if (typeof window !== 'undefined') {
  window.component = component;
  window.TronComponent = { component, use };
}