# @nelsondev/component

Lightweight web component library with a clean API for building reusable custom elements.

## Installation

```bash
npm install @nelsondev/component
```

## Hello World

```javascript
import { defineComponent } from '@nelsondev/component';

defineComponent('hello-world', ({ defineProps, defineTemplate }) => {
    const props = defineProps(['name']);
    defineTemplate(`<h1>Hello, ${props.name}!</h1>`);
});
```

```html
<hello-world name="nelsontron"></hello-world>
```

## API Reference
### `defineComponent(tagName, definition)`
Register a component.

#### Parameters
- `tagName` (string) - Custom element name (must contain hyphen)
- `definition` (function) - Component definition receiving context object

#### Exampple
```javascript
defineComponent('my-component', (context) => {
    // component definition
})
```

---
### `element`
Reference to the component's DOM element.

---
### `defineSlots(names)`
Define content projection slots.

#### Parameters
- `names` (array) - Array of slot names (defaults to ['default'])

---
### `defineProps(propsList)`
Define component properties with automatic type conversion.

#### Parameters
- `propList` (array) - Array of property definitions

---
### `defineStyle()`
Get component's CSS classes.

---
### `defineEvent(handler)`
Create event handler for templates.

#### Parameters:
- `handler` (function) - Event handler function

---
### `exportEvent(name, handler)`
Expose method on component instance.

#### Parameters:
- `name` (string) - Method name
- `handler` (function) - Handler function

---
#### `onMounted(callback)`
Register mounted lifecycle hook.

#### Parameters:
- `callback` (function) - Callback function

---
#### `onUnmounted(callback)`
Register mounted lifecycle hook.

#### Parameters:
- `callback` (function) - Callback function

---
### `defineTemplate(html)`
Set component HTML template.

#### Parameters:
- `html` (string) - HTML template string

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

```html
<my-counter value="5"></my-counter>
```

### Modal Component

```javascript
defineComponent('my-modal', ({ defineSlots, defineEvent, exportEvent, element }) => {
  const slots = defineSlots();
  
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
        <button onclick="${hide}">×</button>
      </div>
    </div>
  `);
});
```

```html
<my-modal>
  <h2>Modal Title</h2>
  <p>Modal content here</p>
</my-modal>

<script>
  document.querySelector('my-modal').show();
</script>
```

### Slotted Component

```javascript
defineComponent('my-card', ({ defineSlots, defineTemplate }) => {
  const slots = defineSlots(['header', 'default', 'footer']);
  
  defineTemplate(`
    <div class="card">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>
  `);
});
```

```html
<my-card>
  <template slot="header">Card Title</template>
  <p>Card content</p>
  <template slot="footer">
    <button>Action</button>
  </template>
</my-card>
```

## Browser Support

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT