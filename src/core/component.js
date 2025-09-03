import { createContext } from './context.js';
import { kebabToCamel } from '../utils/utils.js';

const registry = new Map();
const pending = new Set();
const callbacks = [];

export function ready(callback) {
    callbacks.push(callback)
}

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

            pending.add(this)
        }

        connectedCallback() {
            // Capture content immediately when element is connected, before any nested components are upgraded
            this._captureOriginalContent();
            
            // Process the component definition in the next tick to allow content capture
            Promise.resolve().then(() => {
                const context = createContext(this);
                definition.call(context, context);
                this.dispatchEvent(new CustomEvent('mounted'));
                pending.delete(this)
                if (pending.size === 0) {
                    callbacks.forEach(x => x())
                    callbacks = []
                }
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