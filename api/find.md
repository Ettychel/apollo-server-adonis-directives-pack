---
description: Single item request
---

# Find

### For a separate add use:

```javascript
/* ... */
const {
  FindDirective,
  FindTypeDefs
} = require('apollo-server-adonis-directives-pack/src/directives/query/Find')


makeExecutableSchema({ 
  /* ... */ 
  typeDefs: [ FindTypeDefs, /* ... */ ],
  schemaDirectives: { FindDirective, /* ... */} 
})
```

### Directive Description

```graphql
directive @find(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String
) on FIELD_DEFINITION
```

### Example

```graphql
type Query {
    postFind(id: String!): Post @find
}
```

Required argument when writing a request

* id - String/Int/ID

