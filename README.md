# Tron Component

A simple, fast web component library. Just 11KB minified.

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

## API Reference

### `component(tagName, definition)`

Creates a new web component.

```javascript
component('my-component', (ctx) => {
  // Your component logic here
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

### Todo List

```javascript
component('todo-list', ({ react, event, render }) => {
  const todos = react(['Buy groceries', 'Walk the dog']);
  const input = react('');
  
  const addTodo = event(() => {
    if (input.value.trim()) {
      todos.push(input.value);
      input.value = '';
    }
  });
  
  const updateInput = event((e) => {
    input.value = e.target.value;
  });
  
  render(() => `
    <div>
      <input 
        value="${input.value}" 
        oninput="${updateInput}" 
        placeholder="Add todo">
      <button onclick="${addTodo}">Add</button>
      <ul>
        ${todos.render(todo => `<li>${todo}</li>`)}
      </ul>
    </div>
  `);
});
```

### User Profile

```javascript
component('user-profile', ({ react, event, render }) => {
  const user = react({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  const updateName = event((e) => {
    user.value.name = e.target.value;
    user.update();
  });
  
  const updateEmail = event((e) => {
    user.value.email = e.target.value;
    user.update();
  });
  
  render(() => `
    <div>
      <input 
        value="${user.value.name}" 
        oninput="${updateName}" 
        placeholder="Name">
      <input 
        value="${user.value.email}" 
        oninput="${updateEmail}" 
        placeholder="Email">
      <p>Hello ${user.value.name} (${user.value.email})</p>
    </div>
  `);
});
```

## Styling

Since Tron components use Light DOM, you can style them with regular CSS:

```css
/* Style components directly */
my-counter {
  display: block;
  padding: 1rem;
  border: 1px solid #ccc;
}

my-counter button {
  padding: 0.5rem 1rem;
  margin: 0.25rem;
}

/* Or use any CSS framework */
my-counter .btn {
  /* Bootstrap classes work fine */
}
```

You can also include CSS files normally:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
```

## Manual Updates

For objects, use `.update()` to trigger re-renders:

```javascript
const data = react({ items: [] });

// Change the object
data.value.items.push('new item');

// Manually trigger update
data.update();
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