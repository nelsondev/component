/**
 * Component System - Main component creation and management
 */

import morphdom from 'morphdom';
import { createContext } from './context.js';
import { setupProps } from './props.js';

const registry = new Map();

// Update batcher for efficient rendering
class UpdateBatcher {
  constructor() {
    this.pending = new Set();
    this.scheduled = false;
  }

  schedule(component) {
    this.pending.add(component);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  flush() {
    const updates = [...this.pending];
    this.pending.clear();
    this.scheduled = false;
    
    updates.forEach(component => {
      if (component.isConnected) {
        component._render();
      }
    });
  }
}

const batcher = new UpdateBatcher();

// Intersection observer for performance
function setupVisibilityObserver(component) {
  if (!window.IntersectionObserver) {
    component._visible = true;
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      component._visible = entries[0].isIntersecting;
    },
    { threshold: 0.1 }
  );
  
  observer.observe(component);
  component._observer = observer;
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
      this._visible = true;
      this._updateScheduled = false;

      // Create and call context
      const context = createContext(this);
      definition.call(context, context);
    }

    connectedCallback() {
      this._applyStyles();
      setupProps(this);
      setupVisibilityObserver(this);
      this._scheduleUpdate();
      this.dispatchEvent(new CustomEvent('mounted'));
    }

    disconnectedCallback() {
      this._observer?.disconnect();
      this._reactives.clear();
      this.dispatchEvent(new CustomEvent('unmounted'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this._props) {
        const propName = this._kebabToCamel(name);
        if (propName in this._props) {
          this._scheduleUpdate();
        }
      }
    }

    _scheduleUpdate() {
      if (!this._updateScheduled && this.isConnected) {
        this._updateScheduled = true;
        batcher.schedule(this);
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
      const template = document.createElement('template');
      template.innerHTML = html;
      
      if (this.shadowRoot.firstElementChild && template.content.firstElementChild) {
        morphdom(this.shadowRoot.firstElementChild, template.content.firstElementChild);
      } else {
        this.shadowRoot.innerHTML = html;
      }
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

    _kebabToCamel(str) {
      return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    forceUpdate() {
      this._scheduleUpdate();
    }
  }

  customElements.define(tagName, TronComponent);
  registry.set(tagName, TronComponent);
  return TronComponent;
}