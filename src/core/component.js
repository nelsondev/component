import { createContext } from './context.js';

const registry = new Map();

export function defineComponent(tagName, definition) {
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

            this._definition = definition;

            // Create unique instance ID
            this._instanceId = `cc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        }

        connectedCallback() {
            // Capture content immediately when element is connected, before any nested components are upgraded
            this._captureOriginalContent();
            
            // Process the component definition in the next tick to allow content capture
            Promise.resolve().then(() => {
                const context = createContext(this);
                definition.call(context, context);
                this.dispatchEvent(new CustomEvent('mounted'));
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
                this._propsCache.delete(this._kebabToCamel(name));
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

        _kebabToCamel(str) {
            return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        }

        _captureOriginalContent() {
            // Capture the innerHTML immediately - this should contain the original, unprocesed content
            this._originalContent = this.innerHTML;
            
            // Create a map to store content by element reference
            const elementContentMap = new Map();
            
            // Also capture text content of any nested custom elements to preserve their slot content
            const nestedCustomElements = this.querySelectorAll('*');
            nestedCustomElements.forEach(element => {
                const tagName = element.tagName.toLowerCase();
                if (tagName.includes('-') && !element._originalContentCaptured) {
                    // Store the original content mapped to the specific element
                    elementContentMap.set(element, element.innerHTML);
                    element._preservedSlotContent = element.innerHTML;
                    element._originalContentCaptured = true;
                }
            });
            
            // Store the map on this component instance for later use
            this._elementContentMap = elementContentMap;
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

            // Restore preserved content for any nested custom elements using the stored map
            if (this._elementContentMap) {
                const nestedElements = tempDiv.querySelectorAll('*');
                const realNestedElements = Array.from(this.querySelectorAll('*'));
                
                nestedElements.forEach((element, index) => {
                    const tagName = element.tagName.toLowerCase();
                    if (tagName.includes('-')) {
                        // Match by index within the same tag type to maintain correspondence
                        const realElement = realNestedElements[index];
                        if (realElement && this._elementContentMap.has(realElement)) {
                            element.innerHTML = this._elementContentMap.get(realElement);
                        }
                    }
                });
            }

            // Only process slots that are direct children (not nested in other custom elements)
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

            // Get direct child elements with slot attribute (legacy support)
            const directSlotElements = Array.from(tempDiv.children).filter(child => 
                child.hasAttribute('slot') && child.tagName !== 'TEMPLATE'
            );
            
            directSlotElements.forEach(el => {
                const slotName = el.getAttribute('slot');
                if (!namedSlots[slotName]) {
                    namedSlots[slotName] = el.outerHTML;
                }
                el.remove();
            });

            this._namedSlots = namedSlots;
            
            // Everything remaining is default slot content
            this._defaultSlotContent = tempDiv.innerHTML.trim();
        }
    }

    customElements.define(tagName, ColeComponent);
    registry.set(tagName, ColeComponent);
    return ColeComponent;
}