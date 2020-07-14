---
description: Request all type data
---

# All

### For a separate add use:

```javascript
/* ... */
const {
  AllDirective,
  AllTypeDefs
} = require('apollo-server-adonis-directives-pack/src/directives/query/All')

makeExecutableSchema({ 
  /* ... */ 
  typeDefs: [ AllTypeDefs, /* ... */ ],
  schemaDirectives: { AllDirective, /* ... */} 
})
```

### Directive Description

{% code title="AllTypeDefs" %}
```graphql
# returns a collection of all models of this specified return type
directive @all on FIELD_DEFINITION
```
{% endcode %}

### Example

```graphql
type Query {
    posts: [Post] @all
}
```

