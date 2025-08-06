/**
 * Component Context - Simplified API for better performance
 */

import { createReactiveAny } from './reactive.js';
import { createProps } from './props.js';

export function createContext(component) {
  return {
    /**
     * Create reactive state (manual updates for objects)
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