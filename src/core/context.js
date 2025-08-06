import { createReactiveAny } from './reactive.js';
import { createProps } from './props.js';
import { computed } from '@preact/signals-core';

export function createContext(component) {
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
      return computed(fn);
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