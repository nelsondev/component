import { signal, effect } from '@preact/signals-core';

export function createReactive(component, initialValue) {
  const reactive = signal(initialValue);
 
  reactive.update = function() {
    this.value = this.value;
    return this;
  };
 
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return String(this.value); };
 
  const cleanup = effect(() => {
    reactive.value;
    if (component.isConnected) {
      component._scheduleUpdate();
    }
  });
 
  reactive.dispose = cleanup;
  component._reactives.set(reactive, true);
  return reactive;
}

export function createReactiveArray(component, initialValue) {
  const reactive = signal([...initialValue]);
 
  reactive.render = function(template) {
    return this.value.map((item, index) =>
      typeof template === 'function' ? template(item, index) : template
    ).join('');
  };
 
  const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
 
  arrayMethods.forEach(method => {
    reactive[method] = function(...args) {
      const result = this.value[method](...args);
      this.value = [...this.value];
      return result;
    };
  });
 
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return JSON.stringify(this.value); };
 
  const cleanup = effect(() => {
    reactive.value;
    if (component.isConnected) {
      component._scheduleUpdate();
    }
  });
 
  reactive.dispose = cleanup;
  component._reactives.set(reactive, true);
  return reactive;
}

export function createReactiveAny(component, value) {
  if (Array.isArray(value)) {
    return createReactiveArray(component, value);
  } else {
    return createReactive(component, value);
  }
}