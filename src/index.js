/**
 * Tron Component
 * @author Nelson M
 */

import { defineComponent } from './core/component.js'

// Expose globally for script tag usage
if (typeof window !== 'undefined') {
    window.defineComponent = defineComponent;
    window.TronComponent = { defineComponent };
}

export { defineComponent }