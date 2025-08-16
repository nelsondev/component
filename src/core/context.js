import { createProps } from './props.js';

export function createContext(component) {
    return {
        /**
         * Reference to the component element
         */
        element: component,

        /**
         * Define component properties with cleaner API
         */
        defineProps(propList = []) {
            return createProps(component, propList);
        },

        /**
         * Create event handlers - returns a function that can be used in templates
         */
        defineEvent(handler) {
            const name = `_evt${component._eventCounter++}`;
            const globalName = `${component._instanceId}_${name}`;

            component[name] = (...args) => handler(...args);
            component._eventHandlers.add({ name, globalName });

            // Store component reference globally using the unique global name
            window[globalName] = component;

            const eventWrapper = (...args) => component[name](...args);

            eventWrapper.toString = () => {
                const handlerString = handler.toString();
                const paramMatch = handlerString.match(/^\s*(?:async\s+)?\(?([^)]*)\)?\s*=>/);
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
         * Export an event handler to make it available externally on the component
         */
        exportEvent(methodName, handler) {
            const globalName = `${component._instanceId}_${methodName}`;

            // Create the method on the component
            component[methodName] = (...args) => {
                if (typeof handler === 'function') {
                    return handler(...args);
                } else {
                    // If handler is already a defineEvent result, call it
                    return handler(...args);
                }
            };

            // Track for cleanup
            component._eventHandlers.add({ name: methodName, globalName });

            // Store component reference globally
            window[globalName] = component;

            return component[methodName];
        },

        /**
         * Define slots with cleaner API
         */
        defineSlots(slotNames = ['default']) {
            const slots = {};

            slotNames.forEach(slotName => {
                Object.defineProperty(slots, slotName, {
                    get() {
                        // Process slots lazily when first accessed
                        if (!component._slotsProcessed) {
                            component._processSlots();
                        }

                        if (slotName === 'default') {
                            return component._defaultSlotContent || '';
                        }
                        return component._namedSlots[slotName] || '';
                    }
                });
            });

            return slots;
        },

        /**
         * Define component template with cleaner API
         */
        defineTemplate(template) {
            const html = typeof template === 'function' ? template() : String(template);
            component.innerHTML = html;
        },

        /**
         * Forward classes from the component to its first child or specified selector
         */
        defineStyle() {
            return component.className || '';
        },

        /**
         * Lifecycle hooks
         */
        onMounted(callback) {
            component.addEventListener('mounted', callback, { once: true });
        },

        onUnmounted(callback) {
            component.addEventListener('unmounted', callback);
        }
    };
}