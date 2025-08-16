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
            // Check if we have a pending variant prop from defineMixes
            if (component._pendingVariantDefault && !propList.some(prop => 
                (typeof prop === 'string' ? prop : prop.name) === 'variant'
            )) {
                // Add the variant prop automatically
                propList = [...propList, { 
                    name: 'variant', 
                    type: String, 
                    default: component._pendingVariantDefault 
                }];
            }
            
            return createProps(component, propList);
        },

        /**
         * Define variant mixes - automatically creates a 'variant' prop and returns classes
         */
        defineMixes(mixList) {
            // Create a map for quick lookup
            const mixMap = {};
            mixList.forEach(mix => {
                mixMap[mix.name] = mix.classes;
            });

            // Get the default variant (first one or one named 'default')
            const defaultVariant = mixList.find(mix => mix.name === 'default')?.name || mixList[0]?.name || 'default';

            // Store the default for when defineProps is called
            if (!component._variantPropCreated) {
                component._pendingVariantDefault = defaultVariant;
                component._variantPropCreated = true;
            }

            // Return an object that resolves to the appropriate classes
            const mixesProxy = {
                toString() {
                    const variant = (component._props && component._props.variant) || defaultVariant;
                    return mixMap[variant] || mixMap[defaultVariant] || '';
                },

                // Allow direct access to specific variants
                get(variantName) {
                    return mixMap[variantName] || '';
                }
            };

            return mixesProxy;
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