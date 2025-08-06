import { signal, effect } from '@preact/signals-core';

export function createReactive(component, initialValue) {
  const reactive = signal(initialValue);
 
  reactive.update = function() {
    this.value = this.value;
    return this;
  };
 
  reactive.valueOf = function() { return this.value; };
  reactive.toString = function() { return String(this.value); };

  // Add .render() method only for arrays
  if (Array.isArray(initialValue)) {
    reactive.render = function(template) {
      return this.value.map((item, index) =>
        typeof template === 'function' ? template(item, index) : template
      ).join('');
    };
  }
 
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
  return createReactive(component, value);
}