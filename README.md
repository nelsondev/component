# Tron Component

A simple, fast web component library that just works.

## Install

```bash
npm install tron-component
```

Or use directly in the browser:

```html
<script src="https://unpkg.com/tron-component/dist/tron-component.min.js"></script>
```

## Quick Start

```javascript
import { component } from 'tron-component';

component('hello-world', ({ render }) => {
  render(() => `<h1>Hello World!</h1>`);
});
```

```html
<hello-world></hello-world>
```

That's it. You now have a web component.

## Reactive State

```javascript
component('click-counter', ({ react, event, render }) => {
  const count = react(0);
  
  const increment = event(() => count.value++);
  const reset = event(() => count.value = 0);
  
  render(() => `
    <div>
      <h2>Count: ${count.value}</h2>
      <button onclick="${increment}">+</button>
      <button onclick="${reset}">Reset</button>
    </div>
  `);
});
```

## Props

```javascript
component('user-card', ({ props, render }) => {
  const { name, age } = props(['name', 'age']);
  
  render(() => `
    <div class="card">
      <h3>${name}</h3>
      <p>Age: ${age}</p>
    </div>
  `);
});
```

```html
<user-card name="John" age="25"></user-card>
```

## Lists

```javascript
component('todo-list', ({ react, event, render }) => {
  const todos = react(['Buy milk', 'Walk dog']);
  
  const addTodo = event(() => {
    todos.push('New todo');
  });
  
  render(() => `
    <div>
      <ul>
        ${todos.render(todo => `<li>${todo}</li>`)}
      </ul>
      <button onclick="${addTodo}">Add Todo</button>
    </div>
  `);
});
```

## Form Input

```javascript
component('name-form', ({ react, event, render }) => {
  const name = react('');
  
  const updateName = event((e) => {
    name.value = e.target.value;
  });
  
  render(() => `
    <div>
      <input 
        type="text" 
        value="${name.value}" 
        oninput="${updateName}"
        placeholder="Enter your name">
      <p>Hello ${name.value || 'stranger'}!</p>
    </div>
  `);
});
```

## Computed Values

```javascript
component('shopping-cart', ({ react, computed, render }) => {
  const items = react([
    { name: 'Apple', price: 1.20, qty: 3 },
    { name: 'Bread', price: 2.50, qty: 1 }
  ]);
  
  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.qty), 0);
  });
  
  render(() => `
    <div>
      <h3>Shopping Cart</h3>
      ${items.render(item => `
        <div>${item.name} - ${item.price} x ${item.qty}</div>
      `)}
      <strong>Total: ${total.value.toFixed(2)}</strong>
    </div>
  `);
});
```

## Watching Changes

```javascript
component('auto-saver', ({ react, watch, render }) => {
  const text = react('');
  const saved = react(false);
  
  // Auto-save when text changes
  watch(text, (newText) => {
    if (newText) {
      localStorage.setItem('draft', newText);
      saved.value = true;
      setTimeout(() => saved.value = false, 2000);
    }
  });
  
  const updateText = event((e) => {
    text.value = e.target.value;
  });
  
  render(() => `
    <div>
      <textarea oninput="${updateText}">${text.value}</textarea>
      ${saved.value ? '<p>✓ Saved</p>' : ''}
    </div>
  `);
});
```

## Styling

Add CSS to all your components:

```javascript
import { init } from 'tron-component';

await init({
  stylesheets: ['https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'],
  cssText: `
    .card { padding: 1rem; border: 1px solid #ccc; }
    button { padding: 0.5rem 1rem; }
  `
});
```

## Advanced Props

```javascript
component('config-panel', ({ props, render }) => {
  const settings = props([
    { name: 'title', type: String, required: true },
    { name: 'count', type: Number, default: 0 },
    { name: 'visible', type: Boolean, default: false }
  ]);
  
  render(() => `
    <div>
      <h2>${settings.title}</h2>
      ${settings.visible ? `<p>Count: ${settings.count}</p>` : ''}
    </div>
  `);
});
```

```html
<config-panel title="Dashboard" count="42" visible></config-panel>
```

## Lifecycle

```javascript
component('data-loader', ({ react, onMounted, render }) => {
  const data = react(null);
  
  onMounted(async () => {
    const response = await fetch('/api/data');
    data.value = await response.json();
  });
  
  render(() => `
    <div>
      ${data.value ? `<p>${data.value.message}</p>` : '<p>Loading...</p>'}
    </div>
  `);
});
```

## Real Example

```javascript
component('weather-widget', ({ props, react, event, onMounted, render }) => {
  const { city } = props([
    { name: 'city', type: String, default: 'London' }
  ]);
  
  const weather = react(null);
  const loading = react(false);
  
  const fetchWeather = event(async () => {
    loading.value = true;
    try {
      const response = await fetch(`/api/weather?city=${city}`);
      weather.value = await response.json();
    } catch (error) {
      weather.value = { error: 'Failed to load weather' };
    }
    loading.value = false;
  });
  
  onMounted(fetchWeather);
  
  render(() => `
    <div class="weather-widget">
      <h3>Weather in ${city}</h3>
      ${loading.value ? `
        <p>Loading...</p>
      ` : weather.value ? `
        ${weather.value.error ? `
          <p class="error">${weather.value.error}</p>
        ` : `
          <p>${weather.value.temp}°C</p>
          <p>${weather.value.description}</p>
        `}
      ` : ''}
      <button onclick="${fetchWeather}">Refresh</button>
    </div>
  `);
});
```

## TypeScript

Full TypeScript support included:

```typescript
import { component, ComponentContext } from 'tron-component';

component('typed-component', ({ react, render }: ComponentContext) => {
  const count = react<number>(0);
  // count.value is typed as number
});
```

## API Reference

### `react(value)`
Creates reactive state. Returns object with `.value` property.

### `event(handler, name?)`
Creates event handler. Use in templates like `onclick="${handler}"`.

### `props(list)`
Defines component properties from HTML attributes.

### `element`
Reference to the component's DOM element.

### `render(template)`
Sets the component's HTML template.

### `computed(fn)`
Creates computed values that automatically update when dependencies change.

### `watch(reactive, callback, options?)`
Watches reactive values and runs callback when they change.

### Lifecycle
- `onMounted(callback)` - Runs when component is added to page
- `onUpdated(callback)` - Runs after each re-render
- `onBeforeUpdate(callback)` - Runs before each re-render

That's everything you need to know. Build something cool!

## License

MIT © Nelson M