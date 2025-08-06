import { createContext } from './context.js';

const registry = new Map();

function updateDOM(parent, newHTML) {
  if (parent.innerHTML !== newHTML) {
    parent.innerHTML = newHTML;
  }
}

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
     
      // Initialize component state
      this._reactives = new Map();
      this._eventHandlers = new Set();
      this._eventListeners = new Set();
      this._eventCounter = 0;
      this._template = null;
      this._lastHTML = '';
      this._firstRender = true;
      this._updateScheduled = false;
      this._originalContent = null;
      this._namedSlots = {};
      this._hasSlots = false;
      this._defaultSlotContent = '';
      this._processedSlotsCache = null;
      this._slotsVersion = 0;
      
      // Create and call context
      const context = createContext(this);
      definition.call(context, context);
    }

    connectedCallback() {
      this._scheduleUpdate();
      this.dispatchEvent(new CustomEvent('mounted'));
    }

    disconnectedCallback() {
      // Clean up event handlers
      this._eventHandlers.forEach(handlerName => {
        delete this[handlerName];
      });
      this._eventHandlers.clear();
      
      // Clean up event listeners
      this._eventListeners.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
      });
      this._eventListeners.clear();
      
      this._reactives.clear();
      this.dispatchEvent(new CustomEvent('unmounted'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this._props) {
        if (this._propsCache) {
          this._propsCache.clear();
        }
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

        const processedHTML = this._processSlots(html);
        updateDOM(this, processedHTML);
        
        this._lastHTML = html;
        this._firstRender = false;
        this.dispatchEvent(new CustomEvent('updated'));
      } catch (error) {
        console.error(`Error rendering ${tagName}:`, error);
      }
    }

    _processSlots(html) {
      if (this._firstRender && !this._originalContent) {
        this._originalContent = this.innerHTML;
        this._namedSlots = this._extractNamedSlots();
        this._hasSlots = html.includes('<slot');
        this._defaultSlotContent = this._getDefaultSlotContent();
        this._slotsVersion++;
      }

      if (!this._hasSlots) return html;

      if (this._processedSlotsCache && this._processedSlotsCache.version === this._slotsVersion) {
        return this._processedSlotsCache.result;
      }

      const result = html.replace(/<slot(\s+name=["']([^"']+)["'])?[^>]*><\/slot>/g, (match, nameAttr, slotName) => {
        if (slotName) {
          return this._namedSlots[slotName] || '';
        } else {
          return this._defaultSlotContent;
        }
      });

      this._processedSlotsCache = {
        version: this._slotsVersion,
        result: result
      };

      return result;
    }

    _extractNamedSlots() {
      const namedSlots = {};
      
      if (!this._originalContent) return namedSlots;
      
      if (!this._originalContent.includes('slot=')) return namedSlots;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this._originalContent;
      
      tempDiv.querySelectorAll('[slot]').forEach(el => {
        const slotName = el.getAttribute('slot');
        namedSlots[slotName] = el.outerHTML;
      });
      
      return namedSlots;
    }

    _getDefaultSlotContent() {
      if (!this._originalContent) return '';
      
      if (!this._originalContent.includes('slot=')) {
        return this._originalContent;
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this._originalContent;
      
      tempDiv.querySelectorAll('[slot]').forEach(el => el.remove());
      
      return tempDiv.innerHTML;
    }

    _isVisible() {
      if (!this.isConnected) return false;
      
      try {
        const rect = this.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      } catch {
        return false;
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