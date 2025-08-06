/*!
 * Tron Component v1.0.0
 * Ultra-simple reactive web component library
 * (c) 2024 Nelson M
 * Released under the MIT License
 */
const i=Symbol.for("preact-signals");function t(){if(r>1){r--;return}let i,t=false;while(void 0!==s){let o=s;s=void 0;f++;while(void 0!==o){const n=o.o;o.o=void 0;o.f&=-3;if(!(8&o.f)&&v(o))try{o.c();}catch(o){if(!t){i=o;t=true;}}o=n;}}f=0;r--;if(t)throw i}let n,s;function h(i){const t=n;n=void 0;try{return i()}finally{n=t;}}let r=0,f=0,e=0;function c(i){if(void 0===n)return;let t=i.n;if(void 0===t||t.t!==n){t={i:0,S:i,p:n.s,n:void 0,t:n,e:void 0,x:void 0,r:t};if(void 0!==n.s)n.s.n=t;n.s=t;i.n=t;if(32&n.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=n.s;t.n=void 0;n.s.n=t;n.s=t;}return t}}function u(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;}u.prototype.brand=i;u.prototype.h=function(){return  true};u.prototype.S=function(i){const t=this.t;if(t!==i&&void 0===i.e){i.x=t;this.t=i;if(void 0!==t)t.e=i;else h(()=>{var i;null==(i=this.W)||i.call(this);});}};u.prototype.U=function(i){if(void 0!==this.t){const t=i.e,o=i.x;if(void 0!==t){t.x=o;i.e=void 0;}if(void 0!==o){o.e=t;i.x=void 0;}if(i===this.t){this.t=o;if(void 0===o)h(()=>{var i;null==(i=this.Z)||i.call(this);});}}};u.prototype.subscribe=function(i){return E(()=>{const t=this.value,o=n;n=void 0;try{i(t);}finally{n=o;}})};u.prototype.valueOf=function(){return this.value};u.prototype.toString=function(){return this.value+""};u.prototype.toJSON=function(){return this.value};u.prototype.peek=function(){const i=n;n=void 0;try{return this.value}finally{n=i;}};Object.defineProperty(u.prototype,"value",{get(){const i=c(this);if(void 0!==i)i.i=this.i;return this.v},set(i){if(i!==this.v){if(f>100)throw new Error("Cycle detected");this.v=i;this.i++;e++;r++;try{for(let i=this.t;void 0!==i;i=i.x)i.t.N();}finally{t();}}}});function d(i,t){return new u(i,t)}function v(i){for(let t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return  true;return  false}function l(i){for(let t=i.s;void 0!==t;t=t.n){const o=t.S.n;if(void 0!==o)t.r=o;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function y(i){let t,o=i.s;while(void 0!==o){const i=o.p;if(-1===o.i){o.S.U(o);if(void 0!==i)i.n=o.n;if(void 0!==o.n)o.n.p=i;}else t=o;o.S.n=o.r;if(void 0!==o.r)o.r=void 0;o=i;}i.s=t;}function a(i,t){u.call(this,void 0);this.x=i;this.s=void 0;this.g=e-1;this.f=4;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;}a.prototype=new u;a.prototype.h=function(){this.f&=-3;if(1&this.f)return  false;if(32==(36&this.f))return  true;this.f&=-5;if(this.g===e)return  true;this.g=e;this.f|=1;if(this.i>0&&!v(this)){this.f&=-2;return  true}const i=n;try{l(this);n=this;const i=this.x();if(16&this.f||this.v!==i||0===this.i){this.v=i;this.f&=-17;this.i++;}}catch(i){this.v=i;this.f|=16;this.i++;}n=i;y(this);this.f&=-2;return  true};a.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(let i=this.s;void 0!==i;i=i.n)i.S.S(i);}u.prototype.S.call(this,i);};a.prototype.U=function(i){if(void 0!==this.t){u.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(let i=this.s;void 0!==i;i=i.n)i.S.U(i);}}};a.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(let i=this.t;void 0!==i;i=i.x)i.t.N();}};Object.defineProperty(a.prototype,"value",{get(){if(1&this.f)throw new Error("Cycle detected");const i=c(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function _(i){const o=i.u;i.u=void 0;if("function"==typeof o){r++;const s=n;n=void 0;try{o();}catch(t){i.f&=-2;i.f|=8;b(i);throw t}finally{n=s;t();}}}function b(i){for(let t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;_(i);}function g(i){if(n!==this)throw new Error("Out-of-order effect");y(this);n=i;this.f&=-2;if(8&this.f)b(this);t();}function p(i){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;}p.prototype.c=function(){const i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;const t=this.x();if("function"==typeof t)this.u=t;}finally{i();}};p.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;_(this);l(this);r++;const i=n;n=this;return g.bind(this,i)};p.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.o=s;s=this;}};p.prototype.d=function(){this.f|=8;if(!(1&this.f))b(this);};p.prototype.dispose=function(){this.d();};function E(i){const t=new p(i);try{t.c();}catch(i){t.d();throw i}const o=t.d.bind(t);o[Symbol.dispose]=o;return o}

function createReactive(component, initialValue) {
  const reactive = d(initialValue);
  
  // Add update trigger method for manual updates
  reactive.update = function() {
    // Force signal update by reassigning
    this.value = this.value;
    return this;
  };
  
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return String(this.value); };
  
  // Auto-update component when value changes
  E(() => {
    reactive.value; // Subscribe to changes
    if (component.isConnected) {
      component._scheduleUpdate();
    }
  });
  
  component._reactives.set(reactive, true);
  return reactive;
}

function createReactiveArray(component, initialValue) {
  const reactive = d([...initialValue]);
  
  // Add render method for templates
  reactive.render = function(template) {
    return this.value.map((item, index) => 
      typeof template === 'function' ? template(item, index) : template
    ).join('');
  };
  
  // Override array methods to work with signals
  const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  
  arrayMethods.forEach(method => {
    reactive[method] = function(...args) {
      const newArray = [...this.value];
      const result = newArray[method](...args);
      this.value = newArray;
      return result;
    };
  });
  
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return JSON.stringify(this.value); };
  
  // Auto-update component when array changes
  E(() => {
    reactive.value; // Subscribe to changes
    if (component.isConnected) {
      component._scheduleUpdate();
    }
  });
  
  component._reactives.set(reactive, true);
  return reactive;
}

// Simple helper to determine what type of reactive to create
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
  
  switch (type) {
    case Boolean:
      return value === 'true' || value === true || value === '';
    case Number:
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case Array:
    case Object:
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return type === Array ? [] : {};
        }
      }
      return value;
    default:
      return String(value);
  }
}

function createProps(component, propList) {
  const properties = {};
  const proxy = {};
  
  // Process prop definitions
  propList.forEach(prop => {
    const config = typeof prop === 'string' 
      ? { name: prop, type: String, default: '' }
      : { type: String, default: '', ...prop };
    
    properties[config.name] = config;
  });
  
  // Set up component metadata for attribute observation
  component.constructor.properties = properties;
  component.constructor.observedAttributes = Object.keys(properties).map(camelToKebab);
  
  // Create proxy for props access
  Object.keys(properties).forEach(name => {
    const config = properties[name];
    const kebabName = camelToKebab(name);
    
    Object.defineProperty(proxy, name, {
      get() {
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
      
      // Store the actual function on the component
      component[name] = (...args) => handler(...args);
      
      // Create a smart wrapper that can be used both ways
      const eventWrapper = (...args) => {
        // If called directly, execute the handler
        return component[name](...args);
      };
      
      // Add template string generation
      eventWrapper.toString = () => {
        // Smart event binding based on handler signature
        const handlerStr = handler.toString();
        const hasParams = /^\s*\(\s*[^)]+\s*\)/.test(handlerStr);
        
        if (!hasParams) {
          return `this.getRootNode().host.${name}()`;
        }
        
        const hasMultipleParams = handlerStr.includes(',');
        if (hasMultipleParams) {
          return `this.getRootNode().host.${name}(event)`;
        }
        
        return `(function(e){e.preventDefault();this.getRootNode().host.${name}(e)}).call(this,event)`;
      };
      
      // Make it work in template literals
      eventWrapper.valueOf = eventWrapper.toString;
      
      return eventWrapper;
    },

    /**
     * Define component properties
     */
    props(propList) {
      return createProps(component, propList);
    },

    /**
     * Create computed properties
     */
    computed(fn) {
      const computed = {
        _fn: fn,
        _cache: null,
        _dirty: true,
        get value() {
          if (this._dirty) {
            this._cache = this._fn();
            this._dirty = false;
          }
          return this._cache;
        }
      };

      // Auto-invalidate when component updates
      const originalSchedule = component._scheduleUpdate;
      component._scheduleUpdate = function() {
        computed._dirty = true;
        originalSchedule.call(this);
      };

      return computed;
    },

    /**
     * Define component template
     */
    render(template) {
      component._template = template;
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

/**
 * Style Manager - CSS and styling management
 */

class StyleManager {
  async init(options = {}) {
    const { stylesheets = [], cssText = '', autoDetect = false } = options;
    
    let css = cssText;
    let imports = [...stylesheets];
    
    // Auto-detect existing stylesheets
    if (autoDetect) {
      const detected = this._detectExistingStyles();
      css = detected.css + '\n' + css;
      imports = [...detected.imports, ...imports];
    }
    
    // Add base component styles
    css += this._getBaseStyles();
    
    // Combine everything
    const finalCSS = this._combineStyles(imports, css);
    
    // Apply styles
    if (this._supportsAdoptedStyleSheets() && finalCSS) {
      try {
        const styleSheet = new CSSStyleSheet();
        await styleSheet.replace(finalCSS);
        window.__tronStyles__ = styleSheet;
      } catch (error) {
        window.__tronStyles__ = finalCSS;
      }
    } else {
      window.__tronStyles__ = finalCSS;
    }
    
    return this;
  }

  _detectExistingStyles() {
    const css = [];
    const imports = [];
    
    try {
      // Check document.styleSheets (traditional method)
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            Array.from(rules).forEach(rule => {
              if (rule.cssText) css.push(rule.cssText);
            });
          }
        } catch (error) {
          // CORS or access issues - add as import
          if (sheet.href) imports.push(sheet.href);
        }
      });
      
      // Also check for Vite-injected <style> tags
      document.querySelectorAll('style[data-vite-dev-id], style[type="text/css"]').forEach(styleTag => {
        if (styleTag.textContent) {
          css.push(styleTag.textContent);
        }
      });
      
    } catch (error) {
      // Ignore errors
    }
    
    return { css: css.join('\n'), imports };
  }

  _getBaseStyles() {
    return `
/* Tron Component Base Styles */
:host {
  display: block;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
`;
  }

  _combineStyles(imports, css) {
    const importStatements = imports.map(url => `@import url('${url}');`).join('\n');
    return imports.length > 0 ? `${importStatements}\n${css}` : css;
  }

  _supportsAdoptedStyleSheets() {
    return 'adoptedStyleSheets' in Document.prototype;
  }
}

/**
 * Tron Component Library
 * Ultra-simple reactive web component library
 * @author Nelson M
 * @license MIT
 */


const styleManager = new StyleManager();

async function init(options = {}) {
  await styleManager.init(options);
  return { component, init };
}

function component(tagName, definition) {
  return createComponent(tagName, definition);
}

// Global registration for script tag usage
if (typeof window !== 'undefined') {
  window.component = component;
  window.TronComponent = { component, init };
}

export { component, init };
