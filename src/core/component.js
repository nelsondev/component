/**
 * Component System - Optimized without morphdom
 */

import { createContext } from './context.js';
import { setupProps } from './props.js';

const registry = new Map();

// Simple DOM diffing - much lighter than morphdom
function updateDOM(parent, newHTML) {
  // For most use cases, innerHTML is fast enough and much smaller
  if (parent.innerHTML !== newHTML) {
    parent.innerHTML = newHTML;
  }
}

// Optimized update scheduler
let updateQueue = new Set();
let isScheduled = false;

function scheduleUpdate(component) {
  updateQueue.add(component);
  
  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      const components = [...updateQueue];
      updateQueue.clear();
      isScheduled = false;
      
      // Process visible components first for better perceived performance
      components.sort((a, b) => {
        const aVisible = a._isVisible();
        const bVisible = b._isVisible();
        return bVisible - aVisible;
      });
      
      components.forEach(comp => {
        if (comp.isConnected) {
          comp._render();
        }
      });
    });
  }
}

export function createComponent(tagName, definition) {
  if (registry.has(tagName)) {
    console.warn(`Component ${tagName} already registered`);
    return registry.get(tagName);
  }

  class TronComponent extends HTMLElement {
    static properties = {};

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
      // Initialize component state
      this._reactives = new Map();
      this._eventCounter = 0;
      this._template = null;
      this._lastHTML = '';
      this._firstRender = true;
      this._updateScheduled = false;

      // Create and call context
      const context = createContext(this);
      definition.call(context, context);
    }

    connectedCallback() {
      this._applyStyles();
      setupProps(this);
      this._scheduleUpdate();
      this.dispatchEvent(new CustomEvent('mounted'));
    }

    disconnectedCallback() {
      this._reactives.clear();
      this.dispatchEvent(new CustomEvent('unmounted'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this._props) {
        this._scheduleUpdate();
      }
    }

    _scheduleUpdate() {
      if (!this._updateScheduled && this.isConnected) {
        this._updateScheduled = true;
        scheduleUpdate(this);
      }
    }

    _render() {
      if (!this._template) return;
      
      this._updateScheduled = false;
      this.dispatchEvent(new CustomEvent('beforeUpdate'));

      try {
        const html = typeof this._template === 'function' 
          ? this._template() 
          : String(this._template);

        if (html === this._lastHTML && !this._firstRender) return;

        if (this._firstRender) {
          this._renderInitial(html);
        } else {
          this._renderUpdate(html);
        }

        this._lastHTML = html;
        this._firstRender = false;
        this.dispatchEvent(new CustomEvent('updated'));

      } catch (error) {
        console.error(`Error rendering ${tagName}:`, error);
      }
    }

    _renderInitial(html) {
      const styles = this._getStyles();
      const content = styles ? `<style>${styles}</style>${html}` : html;
      this.shadowRoot.innerHTML = content;
    }

    _renderUpdate(html) {
      // Simple innerHTML replacement - works great for most cases
      // and is much smaller than morphdom
      updateDOM(this.shadowRoot, html);
    }

    _applyStyles() {
      const styles = window.__tronStyles__;
      if (styles instanceof CSSStyleSheet && this.shadowRoot.adoptedStyleSheets) {
        this.shadowRoot.adoptedStyleSheets = [styles];
      }
    }

    _getStyles() {
      const styles = window.__tronStyles__;
      return (styles && typeof styles === 'string') ? styles : null;
    }

    _isVisible() {
      // Simple visibility check - no intersection observer overhead
      try {
        const rect = this.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      } catch {
        return true;
      }
    }

    forceUpdate() {
      this._scheduleUpdate();
    }
  }

  customElements.define(tagName, TronComponent);
  registry.set(tagName, TronComponent);
  return TronComponent;
}