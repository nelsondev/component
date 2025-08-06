/*!
 * Tron Component
 * (c) 2024 Nelson M
 * MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TronComponent = {}));
})(this, (function (exports) { 'use strict';

  const i=Symbol.for("preact-signals");function t(){if(r>1){r--;return}let i,t=false;while(void 0!==s){let o=s;s=void 0;f++;while(void 0!==o){const n=o.o;o.o=void 0;o.f&=-3;if(!(8&o.f)&&v(o))try{o.c();}catch(o){if(!t){i=o;t=true;}}o=n;}}f=0;r--;if(t)throw i}let n,s;function h(i){const t=n;n=void 0;try{return i()}finally{n=t;}}let r=0,f=0,e=0;function c(i){if(void 0===n)return;let t=i.n;if(void 0===t||t.t!==n){t={i:0,S:i,p:n.s,n:void 0,t:n,e:void 0,x:void 0,r:t};if(void 0!==n.s)n.s.n=t;n.s=t;i.n=t;if(32&n.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=n.s;t.n=void 0;n.s.n=t;n.s=t;}return t}}function u(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;}u.prototype.brand=i;u.prototype.h=function(){return  true};u.prototype.S=function(i){const t=this.t;if(t!==i&&void 0===i.e){i.x=t;this.t=i;if(void 0!==t)t.e=i;else h(()=>{var i;null==(i=this.W)||i.call(this);});}};u.prototype.U=function(i){if(void 0!==this.t){const t=i.e,o=i.x;if(void 0!==t){t.x=o;i.e=void 0;}if(void 0!==o){o.e=t;i.x=void 0;}if(i===this.t){this.t=o;if(void 0===o)h(()=>{var i;null==(i=this.Z)||i.call(this);});}}};u.prototype.subscribe=function(i){return E(()=>{const t=this.value,o=n;n=void 0;try{i(t);}finally{n=o;}})};u.prototype.valueOf=function(){return this.value};u.prototype.toString=function(){return this.value+""};u.prototype.toJSON=function(){return this.value};u.prototype.peek=function(){const i=n;n=void 0;try{return this.value}finally{n=i;}};Object.defineProperty(u.prototype,"value",{get(){const i=c(this);if(void 0!==i)i.i=this.i;return this.v},set(i){if(i!==this.v){if(f>100)throw new Error("Cycle detected");this.v=i;this.i++;e++;r++;try{for(let i=this.t;void 0!==i;i=i.x)i.t.N();}finally{t();}}}});function d(i,t){return new u(i,t)}function v(i){for(let t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false}function l(i){for(let t=i.s;void 0!==t;t=t.n){const o=t.S.n;if(void 0!==o)t.r=o;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function y(i){let t,o=i.s;while(void 0!==o){const i=o.p;if(-1===o.i){o.S.U(o);if(void 0!==i)i.n=o.n;if(void 0!==o.n)o.n.p=i;}else t=o;o.S.n=o.r;if(void 0!==o.r)o.r=void 0;o=i;}i.s=t;}function a(i,t){u.call(this,void 0);this.x=i;this.s=void 0;this.g=e-1;this.f=4;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;}a.prototype=new u;a.prototype.h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===e)return  true;this.g=e;this.f|=1;if(this.i>0&&!v(this)){this.f&=-2;return  true}const i=n;try{l(this);n=this;const i=this.x();if(16&this.f||this.v!==i||0===this.i){this.v=i;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}n=i;y(this);this.f&=-2;return  true};a.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(let i=this.s;void 0!==i;i=i.n)i.S.S(i);}u.prototype.S.call(this,i);};a.prototype.U=function(i){if(void 0!==this.t){u.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(let i=this.s;void 0!==i;i=i.n)i.S.U(i);}}};a.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(let i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(a.prototype,"value",{get(){if(1&this.f)throw new Error("Cycle detected");const i=c(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function w(i,t){return new a(i,t)}function _(i){const o=i.u;i.u=void 0;if("function"==typeof o){r++;const s=n;n=void 0;try{o();}catch(t){i.f&=-2;i.f|=8;b(i);throw t}finally{n=s;t();}}}function b(i){for(let t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;_(i);}function g(i){if(n!==this)throw new Error("Out-of-order effect");y(this);n=i;this.f&=-2;if(8&this.f)b(this);t();}function p(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}p.prototype.c=function(){const i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;const t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};p.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;_(this);l(this);r++;const i=n;n=this;return g.bind(this,i)};p.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=s;s=this;}};p.prototype.d=function(){this.f|=8;if(!(1&this.f))b(this);};p.prototype.dispose=function(){this.d();};function E(i){const t=new p(i);try{t.c();}catch(i){t.d();throw i}const o=t.d.bind(t);o[Symbol.dispose]=o;return o}

  function createReactive(component, initialValue) {
    const reactive = d(initialValue);
   
    reactive.update = function() {
      this.value = this.value;
      return this;
    };
   
    reactive.valueOf = function() { return this.value; };
    reactive.toString = function() { return String(this.value); };
   
    const cleanup = E(() => {
      reactive.value;
      if (component.isConnected) {
        component._scheduleUpdate();
      }
    });
   
    reactive.dispose = cleanup;
    component._reactives.set(reactive, true);
    return reactive;
  }

  function createReactiveArray(component, initialValue) {
    const reactive = d([...initialValue]);
   
    reactive.render = function(template) {
      return this.value.map((item, index) =>
        typeof template === 'function' ? template(item, index) : template
      ).join('');
    };
   
    const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
   
    arrayMethods.forEach(method => {
      reactive[method] = function(...args) {
        const result = this.value[method](...args);
        this.value = [...this.value];
        return result;
      };
    });
   
    reactive.valueOf = function() { return this.value; };
    reactive.toString = function() { return JSON.stringify(this.value); };
   
    const cleanup = E(() => {
      reactive.value;
      if (component.isConnected) {
        component._scheduleUpdate();
      }
    });
   
    reactive.dispose = cleanup;
    component._reactives.set(reactive, true);
    return reactive;
  }

  function createReactiveAny(component, value) {
    if (Array.isArray(value)) {
      return createReactiveArray(component, value);
    } else {
      return createReactive(component, value);
    }
  }

  function camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function convertValue(value, type) {
    if (value == null) return value;
    
    if (type === Boolean) {
      return value === '' || value === 'true' || value === true;
    }
    if (type === Number) {
      const num = +value; // Shorter than Number(value)
      return isNaN(num) ? 0 : num;
    }
    if (type === Array || type === Object) {
      if (typeof value === 'string') {
        try { return JSON.parse(value); }
        catch { return type === Array ? [] : {}; }
      }
      return value;
    }
    return String(value);
  }

  function createProps(component, propList) {
    const properties = {};
    const proxy = {};
    
    component._propsCache = new Map();
   
    propList.forEach(prop => {
      const config = typeof prop === 'string'
        ? { name: prop, type: String, default: '' }
        : { type: String, default: '', ...prop };
     
      properties[config.name] = config;
    });
   
    component.constructor.properties = properties;
    component.constructor.observedAttributes = Object.keys(properties).map(camelToKebab);
   
    Object.keys(properties).forEach(name => {
      const config = properties[name];
      const kebabName = camelToKebab(name);
     
      Object.defineProperty(proxy, name, {
        get() {
          if (component._propsCache.has(name)) {
            return component._propsCache.get(name);
          }
          
          const attrValue = component.getAttribute(kebabName);
          const value = attrValue !== null
            ? convertValue(attrValue, config.type)
            : config.default;
         
          if (config.required && value == null) {
            console.warn(`Required prop '${name}' is missing on ${component.tagName}`);
          }
         
          if (config.validator && !config.validator(value)) {
            console.warn(`Invalid prop '${name}' value:`, value);
          }
          
          component._propsCache.set(name, value);
          return value;
        },
       
        set(value) {
          if (config.validator && !config.validator(value)) {
            console.warn(`Invalid prop '${name}' value:`, value);
            return;
          }
         
          const convertedValue = convertValue(value, config.type);
          component.setAttribute(kebabName, convertedValue);
        }
      });
    });
   
    component._props = proxy;
    return proxy;
  }

  function createContext(component) {
    return {
      /**
       * Create reactive state
       */
      react(value) {
        return createReactiveAny(component, value);
      },

      /**
       * Reference to the component element
       */
      element: component,

      /**
       * Create event handlers that work both in templates and as direct function calls
       */
      event(handler, methodName = null) {
        const name = methodName || `_evt${component._eventCounter++}`;
        const globalName = `${component._instanceId}_${name}`;
        
        component[name] = (...args) => handler(...args);
        component._eventHandlers.add({ name, globalName });
        
        // Store component reference globally using the unique global name
        window[globalName] = component;
        
        const eventWrapper = (...args) => component[name](...args);
        
        eventWrapper.toString = () => {
          const handlerStr = handler.toString();
          const paramMatch = handlerStr.match(/^\s*(?:async\s+)?\(?([^)]*)\)?\s*=>/);
          const params = paramMatch ? paramMatch[1].trim() : '';
          
          if (!params) {
            return `window.${globalName}.${name}()`;
          }
          if (params.includes(',')) {
            return `window.${globalName}.${name}(event)`;
          }
          return `(function(e){e.preventDefault();window.${globalName}.${name}(e)}).call(this,event)`;
        };
        
        return eventWrapper;
      },

      /**
       * Add event listener helper
       */
      addEventListener(element, type, handler, options) {
        element.addEventListener(type, handler, options);
        component._eventListeners.add({ element, type, handler });
      },

      /**
       * Define component properties
       */
      props(propList) {
        return createProps(component, propList);
      },

      /**
       * Create computed properties - now using Preact's computed directly
       */
      computed(fn) {
        return w(fn);
      },

      /**
       * Define component template
       */
      render(template) {
        component._template = template;
        if (component.isConnected) {
          component._scheduleUpdate();
        }
      },

      /**
       * Lifecycle hooks
       */
      onMounted(callback) {
        if (component.isConnected) {
          callback();
        } else {
          component.addEventListener('mounted', callback, { once: true });
        }
      },

      onUpdated(callback) {
        component.addEventListener('updated', callback);
      },

      onBeforeUpdate(callback) {
        component.addEventListener('beforeUpdate', callback);
      },

      onUnmounted(callback) {
        component.addEventListener('unmounted', callback);
      }
    };
  }

  const registry = new Map();
  const plugins = [];

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

  function createComponent(tagName, definition) {
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
        this._lastSlotContent = null;

        // Create and call context
        const context = createContext(this);

        this._instanceId = `tc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Apply plugins
        const enhancedContext = plugins.reduce((ctx, plugin) => plugin(ctx, this) || ctx, context);

        definition.call(enhancedContext, enhancedContext);
      }

      connectedCallback() {
        this._scheduleUpdate();
        this.dispatchEvent(new CustomEvent('mounted'));
      }

      disconnectedCallback() {
        this._eventListeners.forEach(({ element, type, handler }) => {
          element.removeEventListener(type, handler);
        });
        this._eventListeners.clear();

        this._eventHandlers.forEach(handlerName => {
          delete this[handlerName];
          delete window[handlerName];
        });
        this._eventHandlers.clear();

        this._reactives.forEach((_, reactive) => {
          if (reactive && typeof reactive.dispose === 'function') {
            reactive.dispose();
          }
        });
        this._reactives.clear();

        this.dispatchEvent(new CustomEvent('unmounted'));
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          if (this._propsCache) {
            this._propsCache.delete(this._kebabToCamel(name));
          }
          this._scheduleUpdate();
        }
      }

      _kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
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

        const html = typeof this._template === 'function'
          ? this._template()
          : String(this._template);

        if (html === this._lastHTML && !this._firstRender) return;

        const processedHTML = this._processSlots(html);
        updateDOM(this, processedHTML);

        this._lastHTML = html;
        this._firstRender = false;
        this.dispatchEvent(new CustomEvent('updated'));
      }

      _processSlots(html) {
        const currentSlotContent = this.innerHTML;

        if (this._firstRender && !this._originalContent) {
          this._originalContent = currentSlotContent;
          this._lastSlotContent = currentSlotContent;
          this._namedSlots = this._extractNamedSlots();
          this._hasSlots = html.includes('<slot');
          this._defaultSlotContent = this._getDefaultSlotContent();
          this._slotsVersion++;
        } else if (currentSlotContent !== this._lastSlotContent) {
          this._lastSlotContent = currentSlotContent;
          this._namedSlots = this._extractNamedSlots();
          this._defaultSlotContent = this._getDefaultSlotContent();
          this._slotsVersion++;
          this._processedSlotsCache = null;
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
        const currentContent = this._lastSlotContent || this._originalContent;

        if (!currentContent) return namedSlots;

        if (!currentContent.includes('slot=')) return namedSlots;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentContent;

        tempDiv.querySelectorAll('[slot]').forEach(el => {
          const slotName = el.getAttribute('slot');
          namedSlots[slotName] = el.outerHTML;
        });

        return namedSlots;
      }

      _getDefaultSlotContent() {
        const currentContent = this._lastSlotContent || this._originalContent;
        if (!currentContent) return '';

        if (!currentContent.includes('slot=')) {
          return currentContent;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentContent;

        tempDiv.querySelectorAll('[slot]').forEach(el => el.remove());

        return tempDiv.innerHTML;
      }

      _isVisible() {
        if (!this.isConnected) return true;

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

  function use(plugin) {
    if (typeof plugin === 'function') {
      plugins.push(plugin);
    }
  }

  /**
   * Tron Component Library
   * Ultra-simple reactive web component library
   * @author Nelson M
   * @license MIT
   */

  function component(tagName, definition) {
    return createComponent(tagName, definition);
  }

  // Global registration for script tag usage
  if (typeof window !== 'undefined') {
    window.component = component;
    window.TronComponent = { component, use };
  }

  exports.component = component;
  exports.use = use;

}));
