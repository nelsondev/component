/*! @nelsondev/component v1.0.6 - Ultra-lightweight web component library */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TronComponent = {}));
})(this, (function (exports) { 'use strict';

    const camelToKebab = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

    const kebabToCamel = str => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    const convertValue = (value, type) => {
        if (value == null) return value;

        if (type === Boolean) {
            return value === '' || value === 'true' || value === true;
        }
        if (type === Number) {
            const number = +value;
            return isNaN(number) ? 0 : number;
        }
        if (type === Array || type === Object) {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch {
                    return type === Array ? [] : {};
                }
            }
            return value;
        }
        return String(value);
    };

    function createContext(component) {
        return {
            /**
             * Reference to the component element
             */
            element: component,

            /**
             * Define component properties with cleaner API
             */
            defineProps(propList = []) {
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

                            const attributeValue = component.getAttribute(kebabName);
                            const value = attributeValue !== null
                                ? convertValue(attributeValue, config.type)
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

    const registry = new Map();
    const registered = new Set();
    const callbacks = new Array();

    function isReady() {
        for (const component of registered) if (!component._isReady) return;
        readyCallbacks.forEach(cb => cb());
        readyCallbacks = [];
    }

    function ready(callback) {
        callbacks.push(callback);
    }

    function defineComponent(tagName, definition) {
        if (registry.has(tagName)) {
            console.warn(`Component ${tagName} already registered`);
            return registry.get(tagName);
        }

        class ColeComponent extends HTMLElement {
            static properties = {};

            constructor() {
                super();

                // Initialize component state
                this._eventHandlers = new Set();
                this._eventListeners = new Set();
                this._eventCounter = 0;
                this._originalContent = null;
                this._namedSlots = {};
                this._defaultSlotContent = '';
                this._slotsProcessed = false;
                this._isReady = false;

                this._definition = definition;

                // Create unique instance ID
                this._instanceId = `cc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

                registered.add(this);
            }

            connectedCallback() {
                // Capture content immediately when element is connected, before any nested components are upgraded
                this._captureOriginalContent();
                
                // Process the component definition in the next tick to allow content capture
                Promise.resolve().then(() => {
                    const context = createContext(this);
                    definition.call(context, context);
                    this.dispatchEvent(new CustomEvent('mounted'));
                    this._isReady = true;
                    isReady();
                });
            }

            disconnectedCallback() {
                // Clean up event listeners
                this._eventListeners.forEach(({ element, type, handler }) => {
                    element.removeEventListener(type, handler);
                });
                this._eventListeners.clear();

                // Clean up event handlers
                this._eventHandlers.forEach(({ name, globalName }) => {
                    delete this[name];
                    delete window[globalName];
                });
                this._eventHandlers.clear();

                this.dispatchEvent(new CustomEvent('unmounted'));
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue !== newValue && this._propsCache) {
                    this._propsCache.delete(kebabToCamel(name));
                }
            }

            render() {
                // Clear all caches
                if (this._propsCache) {
                    this._propsCache.clear();
                }
                
                // Reset slot processing to force fresh slot extraction
                this._slotsProcessed = false;
                
                // Re-capture original content (in case slot content changed)
                this._captureOriginalContent();
                
                // Re-run the component definition with fresh context
                const context = createContext(this);
                this._definition.call(context, context);
                
                // Dispatch event for any cleanup/update logic
                this.dispatchEvent(new CustomEvent('rerendered', { 
                    detail: { timestamp: Date.now() }
                }));
            }

            _captureOriginalContent() {
                // Capture the innerHTML immediately - this should contain the original, unprocesed content
                this._originalContent = this.innerHTML;
                
                // Create a more robust mapping system using element paths instead of indices
                const elementContentMap = new Map();
                
                // Capture content of nested custom elements with their unique identifiers
                const nestedCustomElements = this.querySelectorAll('*');
                nestedCustomElements.forEach(element => {
                    const tagName = element.tagName.toLowerCase();
                    if (tagName.includes('-') && !element._originalContentCaptured) {
                        // Create a unique key based on tag name, position, and content signature
                        const elementKey = this._createElementKey(element);
                        elementContentMap.set(elementKey, element.innerHTML);
                        element._preservedSlotContent = element.innerHTML;
                        element._originalContentCaptured = true;
                        element._elementKey = elementKey; // Store key on element for later matching
                    }
                });
                
                // Store the map on this component instance for later use
                this._elementContentMap = elementContentMap;
            }

            _createElementKey(element) {
                const tagName = element.tagName.toLowerCase();
                const parent = element.parentElement;
                const siblings = Array.from(parent.children).filter(child => 
                    child.tagName.toLowerCase() === tagName
                );
                const indexInSiblings = siblings.indexOf(element);
                const contentSignature = element.innerHTML.slice(0, 50); // First 50 chars as signature
                
                return `${tagName}:${indexInSiblings}:${contentSignature.length}:${contentSignature.replace(/\s+/g, '')}`;
            }

            _processSlots() {
                // Only process slots once
                if (this._slotsProcessed) return;
                
                this._extractSlots();
                this._slotsProcessed = true;
            }

            _extractSlots() {
                if (!this._originalContent) {
                    this._namedSlots = {};
                    this._defaultSlotContent = '';
                    return;
                }

                // Create a temporary container to safely parse HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this._originalContent;

                // Restore preserved content for nested custom elements using robust key matching
                if (this._elementContentMap) {
                    const nestedElements = tempDiv.querySelectorAll('*');
                    
                    nestedElements.forEach(element => {
                        const tagName = element.tagName.toLowerCase();
                        if (tagName.includes('-')) {
                            // Create the same key for this temp element
                            const elementKey = this._createTempElementKey(element, tempDiv);
                            
                            if (this._elementContentMap.has(elementKey)) {
                                element.innerHTML = this._elementContentMap.get(elementKey);
                            }
                        }
                    });
                }

                const namedSlots = {};
                
                // Get direct child template elements with slot attribute
                const directTemplateElements = Array.from(tempDiv.children).filter(child => 
                    child.tagName === 'TEMPLATE' && child.hasAttribute('slot')
                );
                
                directTemplateElements.forEach(template => {
                    const slotName = template.getAttribute('slot');
                    namedSlots[slotName] = template.innerHTML;
                    template.remove();
                });

                this._namedSlots = namedSlots;
                
                // Everything remaining is default slot content
                this._defaultSlotContent = tempDiv.innerHTML.trim();
            }

            _createTempElementKey(element, tempContainer) {
                const tagName = element.tagName.toLowerCase();
                const parent = element.parentElement || tempContainer;
                const siblings = Array.from(parent.children).filter(child => 
                    child.tagName.toLowerCase() === tagName
                );
                const indexInSiblings = siblings.indexOf(element);
                const contentSignature = element.innerHTML.slice(0, 50);
                
                return `${tagName}:${indexInSiblings}:${contentSignature.length}:${contentSignature.replace(/\s+/g, '')}`;
            }
        }

        customElements.define(tagName, ColeComponent);
        registry.set(tagName, ColeComponent);
        return ColeComponent;
    }

    /**
     * Tron Component
     * @author Nelson M
     */


    const html = String.raw;
    const template = html;

    // Expose globally for script tag usage
    if (typeof window !== 'undefined') {
        window.defineComponent = defineComponent;
        window.TronComponent = { defineComponent };
        window.html = html;
        window.template = template;
        window.ready = ready;
    }

    exports.defineComponent = defineComponent;
    exports.html = html;
    exports.ready = ready;
    exports.template = template;

}));
//# sourceMappingURL=tron-component.js.map
