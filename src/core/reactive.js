import { signal, effect } from '@preact/signals-core';

export function createReactive(component, initialValue) {
  const reactive = signal(initialValue);
 
  // Add update trigger method for manual updates
  reactive.update = function() {
    // Force signal update by reassigning
    this.value = this.value;
    return this;
  };
 
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return String(this.value); };
 
  // Auto-update component when value changes
  effect(() => {
    reactive.value; // Subscribe to changes
    if (component.isConnected) {
      component._scheduleUpdate();
    }
  });
 
  component._reactives.set(reactive, true);
  return reactive;
}

export function createReactiveArray(component, initialValue) {
  const reactive = signal([...initialValue]);
 
  // Add render method for templates
  reactive.render = function(template) {
    return this.value.map((item, index) =>
      typeof template === 'function' ? template(item, index) : template
    ).join('');
  };
 
  // Override array methods to work with signals
  const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
 
  arrayMethods.forEach(method => {
    reactive[method] = function(...args) {
      const newArray = [...this.value];
      const result = newArray[method](...args);
      this.value = newArray;
      return result;
    };
  });
 
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return JSON.stringify(this.value); };
 
  // Auto-update component when array changes
  effect(() => {
    reactive.value; // Subscribe to changes
    if (component.isConnected) {
      component._scheduleUpdate();
    }
  });
 
  component._reactives.set(reactive, true);
  return reactive;
}

// Simple helper to determine what type of reactive to create
export function createReactiveAny(component, value) {
  if (Array.isArray(value)) {
    return createReactiveArray(component, value);
  } else {
    return createReactive(component, value);
  }
}