
# vue-remove-attributes
A [`vue-template-compiler`](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler) module that removes unwanted attributes from templates. Neat!


## Installation & Usage
### Install:
```
npm install -D vue-remove-attributes
```

### Use:
**Import and add to your webpack configuration**:

ES Module:
```javascript
import createAttributeRemover from 'vue-remove-attributes';
```
CommonJS:
```javascript
const createAttributeRemover = require('vue-remove-attributes');
```

**Pass the module to `vue-loader` in your webpack config**:
```javascript
module: {
  rules: [{
    test: /\.vue$/,
    use: {
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          modules: [
            createAttributeRemover('data-testid')
          ]
        }
      }
    }
  }]
}
```

**Voilà!** Your vue templates, littered with unwanted attributes (for tests, etc):
```html
<template>
  <ul class="list" data-testid="test-list">
    <li
      class="list-item"
      v-for="n in 3"
      data-testid="test-item"
    >
      {{ n }}
    </li>
  </ul>
</template>
```
Now beautiful for production:
```html
<ul class="list">
  <li class="list-item"> 1 </li>
  <li class="list-item"> 2 </li>
  <li class="list-item"> 3 </li>
</ul>
```
Saving us _entire bytes_ over the wire. :rocket:

### API:
#### `createAttributeRemover(matcher)`
Returns a [`vue-template-compiler`](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler) module.
* `matcher` - Criteria to match attributes against. Can be one of the following types:
  * `string` - `createAttributeRemover('data-testid')` will remove `data-testid`
  * `string[]` - `createAttributeRemover(['data-foo', 'data-bar'])` will remove `data-foo` and `data-bar`
  * `RegExp` - `createAttributeRemover(/^:?data-testid$/)` will remove `data-testid` and `:data-testid`

**Note**: The module will match attributes as their raw values in Vue templates, not their compiled result. As such, `data-testid`, `:data-testid`, and `v-bind:data-testid` are all treated as separate attributes, even though they render identically. Specify each permutation explicitly for a comprehensive removal experience, e.g. `createAttributeRemover(['data-testid', ':data-testid', 'v-bind:data-testid'])`.


## License
[MIT](https://github.com/emensch/vue-remove-attributes/blob/master/LICENSE)