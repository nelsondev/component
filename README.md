# @nelsondev/component

Ultra-lightweight web component library with a clean API for building reusable components.

## Installation

```bash
npm install @nelsondev/component
```

## Quick Start

```javascript
import { defineComponent } from '@nelsondev/component';

defineComponent('my-button', ({ defineProps, defineTemplate, defineEvent }) => {
  const props = defineProps([
    { name: 'text', type: String, required: true },
    { name: 'disabled', type: Boolean, default: false }
  ]);

  const handleClick = defineEvent(() => {
    console.log('Button clicked!');
  });

  defineTemplate(`
    <button onclick="${handleClick}" ${props.disabled ? 'disabled' : ''}>
      ${props.text}
    </button>
  `);
});
```

```html
<my-button text="Click me" disabled="false"></my-button>
```

## API Reference

### defineComponent(tagName, definition)

Creates a custom web component.

```javascript
defineComponent('my-component', (context) => {
  // Component definition
});
```

### Context Methods

#### defineProps(propList)

Define component properties with automatic type conversion.

```javascript
const props = defineProps([
  'title',                                    // String prop
  { name: 'count', type: Number, default: 0 }, // Number with default
  { name: 'items', type: Array, required: true }, // Required array
  { name: 'visible', type: Boolean }           // Boolean prop
]);

// Usage: <my-component title="Hello" count="5" visible></my-component>
// Access: props.title, props.count, props.items, props.visible
```

**Supported types:** `String`, `Number`, `Boolean`, `Array`, `Object`

#### defineEvent(handler)

Create event handlers for templates.

```javascript
const handleSubmit = defineEvent((event) => {
  event.preventDefault();
  console.log('Form submitted');
});

const handleClick = defineEvent(() => {
  alert('Clicked!');
});

defineTemplate(`
  <form onsubmit="${handleSubmit}">
    <button onclick="${handleClick}">Submit</button>
  </form>
`);
```

#### exportEvent(methodName, handler)

Expose methods on the component instance.

```javascript
const show = defineEvent(() => {
  element.style.display = 'block';
});

exportEvent('show', show);

// Usage: document.querySelector('my-modal').show()
```

#### defineSlots(slotNames)

Handle content projection.

```javascript
const slots = defineSlots(['header', 'default', 'footer']);

defineTemplate(`
  <div class="modal">
    <header>${slots.header}</header>
    <main>${slots.default}</main>
    <footer>${slots.footer}</footer>
  </div>
`);
```

```html
<my-modal>
  <template slot="header">Modal Title</template>
  <p>Modal content goes here</p>
  <template slot="footer">
    <button>Close</button>
  </template>
</my-modal>
```

#### defineTemplate(template)

Set the component's HTML.

```javascript
defineTemplate(`
  <div class="card">
    <h2>${props.title}</h2>
    <p>${slots.default}</p>
  </div>
`);
```

#### defineStyle()

Access component's CSS classes.

```javascript
const style = defineStyle();

defineTemplate(`
  <div class="component ${style}">
    Content
  </div>
`);
```

#### Lifecycle Hooks

```javascript
onMounted(() => {
  console.log('Component mounted');
});

onUnmounted(() => {
  console.log('Component unmounted');
});
```

## Advanced Features

### Property Validation

```javascript
const props = defineProps([
  {
    name: 'email',
    type: String,
    required: true,
    validator: (value) => value.includes('@')
  }
]);
```

### Re-rendering

```javascript
// Manually trigger re-render
document.querySelector('my-component').render();
```

### Component Reference

```javascript
defineComponent('my-component', ({ element }) => {
  // element is the component's DOM element
  element.classList.add('initialized');
});
```

## Examples

### Counter Component

```javascript
defineComponent('my-counter', ({ defineProps, defineTemplate, defineEvent }) => {
  const props = defineProps([
    { name: 'value', type: Number, default: 0 }
  ]);

  const increment = defineEvent(() => {
    props.value = props.value + 1;
  });

  defineTemplate(`
    <div>
      <span>Count: ${props.value}</span>
      <button onclick="${increment}">+</button>
    </div>
  `);
});
```

### Modal Component

```javascript
defineComponent('my-modal', ({ defineSlots, defineEvent, exportEvent, element }) => {
  const slots = defineSlots(['default']);

  const show = defineEvent(() => {
    element.style.display = 'block';
  });

  const hide = defineEvent(() => {
    element.style.display = 'none';
  });

  exportEvent('show', show);
  exportEvent('hide', hide);

  defineTemplate(`
    <div class="modal-backdrop" onclick="${hide}">
      <div class="modal-content" onclick="event.stopPropagation()">
        ${slots.default}
        <button onclick="${hide}">Close</button>
      </div>
    </div>
  `);
});
```

## Browser Support

Modern browsers with Custom Elements v1 support:
- Chrome 54+
- Firefox 63+  
- Safari 10.1+
- Edge 79+

## License

MIT