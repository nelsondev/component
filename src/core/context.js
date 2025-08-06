/**
 * Component Context - API methods available to components
 */

import { createReactive, createReactiveArray } from './reactive.js';
import { createProps } from './props.js';

export function createContext(component) {
  return {
    /**
     * Create reactive state
     */
    react(value) {
      return Array.isArray(value) 
        ? createReactiveArray(component, value)
        : createReactive(component, value);
    },

    /**
     * Reference to the component element
     */
    element: component,

    /**
     * Create event handlers
     */
    event(handler, methodName = null) {
      const name = methodName || `_evt${component._eventCounter++}`;
      
      component[name] = (...args) => handler(...args);
      
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

      // Auto-invalidate when reactives change
      const originalSchedule = component._scheduleUpdate;
      component._scheduleUpdate = function() {
        computed._dirty = true;
        originalSchedule.call(this);
      };

      return computed;
    },

    /**
     * Watch reactive values
     */
    watch(reactive, callback, options = {}) {
      let oldValue = reactive.value;
      
      const check = () => {
        const newValue = reactive.value;
        if (newValue !== oldValue) {
          callback(newValue, oldValue);
          oldValue = newValue;
        }
      };

      if (options.immediate) {
        callback(reactive.value);
      }

      // Set up watching
      const originalSchedule = component._scheduleUpdate;
      component._scheduleUpdate = function() {
        check();
        originalSchedule.call(this);
      };

      return () => {
        // Cleanup - restore original schedule
        component._scheduleUpdate = originalSchedule;
      };
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