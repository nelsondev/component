/**
 * Tron Component
 * @author Nelson M
 */

import { defineComponent } from './core/component.js'

const html = String.raw;
const template = html;

// Expose globally for script tag usage
if (typeof window !== 'undefined') {
    window.defineComponent = defineComponent;
    window.TronComponent = { defineComponent };
    window.html = html;
    window.template = template;
}

export { defineComponent, html, template }