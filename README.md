# Tron Component

A simple, fast web component library. Just 11KB minified.

## Install

```bash
npm install tron-component
```

Or use directly in the browser:

```html
<script src="https://unpkg.com/@nelsondev/component/dist/tron-component.min.js"></script>
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

## Disclaimer
I wrote this library extremely fast out of need of a simple component system for a very specific use-case. It's got some jank, and its written in an obtuse way. One specific known issue with my implementation is vanilla-components like `<dialog></dialog>` which modify the DOM *do* break the reactive system as they cause un-knowing DOM updates that I'm currently not intercepting.

I'm working toward making this an extremely solid option for **ALL** use cases. Bare with me!

## API Reference

### `component(tagName, definition)`

Creates a new web component.

```javascript
component('my-component', (ctx) => {
  // Your component logic here
});
```

### `use(plugin)`

Registers a plugin that extends component functionality.

```javascript
import { use } from 'tron-component';

// Add logging capability to all components
use((context, component) => {
  context.log = (msg) => console.log(`[${component.tagName}] ${msg}`);
  return context;
});

// Use in components
component('my-component', ({ log, render }) => {
  log('Component initialized');
  render(() => `<div>Hello</div>`);
});
```

### Context Methods

The definition function receives a context object with these methods:

#### `react(value)`

Creates reactive state that triggers re-renders when changed.

```javascript
const count = react(0);
const items = react(['apple', 'banana']);
const user = react({ name: 'John', age: 25 });

// Update values
count.value = 5;
items.push('cherry');
user.value.name = 'Jane';
user.update(); // Manual trigger for object changes
```

#### `event(handler, name?)`

Creates event handlers for templates and direct function calls.

```javascript
const increment = event(() => count.value++);
const handleClick = event((e) => console.log('Clicked'));

// Use in templates
render(() => `<button onclick="${increment}">Count: ${count.value}</button>`);

// Call directly
increment(); // Also works
```

#### `computed(fn)`

Creates cached computed properties that automatically recalculate when dependencies change.

```javascript
const items = react([
  { name: 'Apple', price: 1.20, qty: 3 },
  { name: 'Bread', price: 2.50, qty: 1 }
]);

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + (item.price * item.qty), 0);
});

render(() => `<div>Total: ${total.value.toFixed(2)}</div>`);
```

#### `element`

Reference to the component's DOM element.

```javascript
const myComponent = element;
const dialog = element.querySelector('dialog');
```

#### `props(list)`

Defines component properties from HTML attributes.

```javascript
const { name, age, visible } = props([
  'name',
  { name: 'age', type: Number, default: 0 },
  { name: 'visible', type: Boolean, default: false }
]);

render(() => `<p>Hello ${name}, you are ${age} years old</p>`);
```

#### `render(template)`

Sets the component's HTML template.

```javascript
render(() => `<div>Current count: ${count.value}</div>`);
```

#### Lifecycle Hooks

```javascript
onMounted(() => console.log('Component mounted'));
onUpdated(() => console.log('Component updated'));
onBeforeUpdate(() => console.log('About to update'));
onUnmounted(() => console.log('Component unmounted'));
```

### Array Methods

Reactive arrays have special methods:

```javascript
const todos = react(['Buy milk', 'Walk dog']);

// Array methods trigger updates automatically
todos.push('New item');
todos.splice(0, 1);

// Render arrays in templates
render(() => `
  <ul>
    ${todos.render(item => `<li>${item}</li>`)}
  </ul>
`);
```

### Content Projection (Slots)

Use slots to project content into your components:

```javascript
component('my-card', ({ render }) => {
  render(() => `
    <div class="card">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  `);
});
```

```html
<my-card>
  <h2 slot="header">Card Title</h2>
  <p>This goes in the default slot</p>
  <p slot="footer">Footer content</p>
</my-card>
```

## Plugin System

Extend Tron Component with plugins that add new functionality:

```javascript
import { use } from 'tron-component';

// Router plugin example
use((context, component) => {
  context.router = {
    push: (path) => window.history.pushState({}, '', path),
    current: () => window.location.pathname
  };
  return context;
});

// Persistence plugin example
use((context) => {
  const originalReact = context.react;
  context.persist = (key, initialValue) => {
    const stored = localStorage.getItem(key);
    const reactive = originalReact(stored ? JSON.parse(stored) : initialValue);
    
    // Auto-save on changes
    context.onUpdated(() => {
      localStorage.setItem(key, JSON.stringify(reactive.value));
    });
    
    return reactive;
  };
  return context;
});

// Use plugin features
component('my-app', ({ router, persist, render }) => {
  const user = persist('user', { name: '', loggedIn: false });
  
  render(() => `
    <div>Current route: ${router.current()}</div>
    <div>User: ${user.value.name}</div>
  `);
});
```

## Examples

### Counter

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

## TypeScript

Full TypeScript support included:

```typescript
import { component, ComponentContext } from 'tron-component';

component('my-component', ({ react, render }: ComponentContext) => {
  const count = react<number>(0);
  render(() => `<div>${count.value}</div>`);
});
```

## Browser Support

Works in all modern browsers that support Web Components:
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT - Nelson M
