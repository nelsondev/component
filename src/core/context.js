// context.js - Light DOM only version
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
     
      // Store the actual function on the component
      component[name] = (...args) => handler(...args);
      
      // Track for cleanup
      component._eventHandlers.add(name);
     
      // Create a smart wrapper that can be used both ways
      const eventWrapper = (...args) => {
        return component[name](...args);
      };
     
      // Add template string generation for Light DOM
      eventWrapper.toString = () => {
        const handlerStr = handler.toString();
        const hasParams = /^\s*\(\s*[^)]+\s*\)/.test(handlerStr);
       
        if (!hasParams) {
          return `this.${name}()`;
        }
       
        const hasMultipleParams = handlerStr.includes(',');
        if (hasMultipleParams) {
          return `this.${name}(event)`;
        }
       
        return `(function(e){e.preventDefault();this.${name}(e)}).call(this,event)`;
      };
     
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