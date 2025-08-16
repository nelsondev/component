/**
 * @nelsondev/component - Ultra-lightweight web component library
 * Type definitions for the core component system
 */

export interface PropConfig {
	/** Property name */
	name: string;
	/** Property type constructor (String, Number, Boolean, Array, Object) */
	type?: StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor;
	/** Default value */
	default?: any;
	/** Whether the property is required */
	required?: boolean;
	/** Validation function */
	validator?: (value: any) => boolean;
}

export type PropDefinition = string | PropConfig;

export interface ComponentProps {
	[key: string]: any;
}

export interface ComponentSlots {
	/** Default slot content */
	default: string;
	/** Named slot content */
	[slotName: string]: string;
}

export interface EventHandler {
	(...args: any[]): any;
	toString(): string;
}

export interface ComponentContext {
	/** Reference to the component element */
	element: HTMLElement;

	/**
	 * Define component properties with type conversion and validation
	 * @param propList Array of property definitions
	 * @returns Proxy object with reactive properties
	 */
	defineProps(propList?: PropDefinition[]): ComponentProps;

	/**
	 * Create an event handler that can be used in templates
	 * @param handler Function to handle the event
	 * @returns Event handler with toString() for template usage
	 */
	defineEvent(handler: (...args: any[]) => any): EventHandler;

	/**
	 * Export an event handler to make it available externally on the component
	 * @param methodName Name of the method on the component
	 * @param handler Function to handle the event
	 * @returns The exported method
	 */
	exportEvent(methodName: string, handler: (...args: any[]) => any): (...args: any[]) => any;

	/**
	 * Define component slots for content projection
	 * @param slotNames Array of slot names to define (defaults to ['default'])
	 * @returns Object with slot content
	 */
	defineSlots(slotNames?: string[]): ComponentSlots;

	/**
	 * Define the component's HTML template
	 * @param template HTML template string or function returning template
	 */
	defineTemplate(template: string | (() => string)): void;

	/**
	 * Get CSS classes from the component element
	 * @returns Component's CSS classes
	 */
	defineStyle(): string;

	/**
	 * Register a callback for when the component is mounted
	 * @param callback Function to call when mounted
	 */
	onMounted(callback: () => void): void;

	/**
	 * Register a callback for when the component is unmounted  
	 * @param callback Function to call when unmounted
	 */
	onUnmounted(callback: () => void): void;
}

export type ComponentDefinition = (context: ComponentContext) => void;

export interface TronComponent extends HTMLElement {
	/** Manually trigger a re-render of the component */
	render(): void;
}

/**
 * Define a custom web component
 * @param tagName The custom element tag name (must contain a hyphen)
 * @param definition Function that defines the component behavior
 * @returns The custom element constructor
 */
export function defineComponent(
	tagName: string,
	definition: ComponentDefinition
): typeof HTMLElement;

// Global type augmentation for better IDE support
declare global {
	interface Window {
		TronComponent: {
			defineComponent: typeof defineComponent;
		};
	}
}

export default {
	defineComponent
};