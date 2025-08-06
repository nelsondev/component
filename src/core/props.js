/**
 * Props System - Component property management
 */

function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function convertValue(value, type) {
  if (value == null) return value;
  
  switch (type) {
    case Boolean:
      return value === 'true' || value === true || value === '';
    case Number:
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    case Array:
    case Object:
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return type === Array ? [] : {};
        }
      }
      return value;
    default:
      return String(value);
  }
}

export function createProps(component, propList) {
  const properties = {};
  const proxy = {};
  
  // Process prop definitions
  propList.forEach(prop => {
    const config = typeof prop === 'string' 
      ? { name: prop, type: String, default: '' }
      : { type: String, default: '', ...prop };
    
    properties[config.name] = config;
  });
  
  // Set up component metadata for attribute observation
  component.constructor.properties = properties;
  component.constructor.observedAttributes = Object.keys(properties).map(camelToKebab);
  
  // Create proxy for props access
  Object.keys(properties).forEach(name => {
    const config = properties[name];
    const kebabName = camelToKebab(name);
    
    Object.defineProperty(proxy, name, {
      get() {
        const attrValue = component.getAttribute(kebabName);
        const value = attrValue !== null 
          ? convertValue(attrValue, config.type)
          : config.default;
        
        if (config.required && value == null) {
          console.warn(`Required prop '${name}' is missing on ${component.tagName}`);
        }
        
        if (config.validator && !config.validator(value)) {
          console.warn(`Invalid prop '${name}' value:`, value);
        }
        
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
}

export function setupProps(component) {
  // Props are set up during createProps call
  // This function exists for compatibility but doesn't need to do anything
  // since the proxy handles everything dynamically
}