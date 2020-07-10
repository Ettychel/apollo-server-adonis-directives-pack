# Apollo-server-adonis-relatonship

This package complements apollo-server-adonis with communication directives, namely HasOne, HasMany, BelongsTo.

---

# Install

npm i apollo-server-adonis-relationships

# Usage


The package provides an object with directive classes and an array with GraphQL schemes:

SchemaDirective - object with directive classes  
TypeDefsDirective -array with GraphQL schemes

--- 

Complete your schema configuration with these objects.  
This is an example of how I do it in my projects:
```JavaScript
const { makeExecutableSchema } = require('graphql-tools')
const fs = require('fs')
const typeDefs = fs.readFileSync(__dirname + '/types.graphql', { encoding: 'utf8' })
const resolvers = require('./resolvers.js')
const { find, all } = require('./directives')

const { TypeDefsDirective, SchemaDirective } = require('apollo-server-adonis-relationships')

module.exports = makeExecutableSchema({ 
  typeDefs: [typeDefs, ...TypeDefsDirective],
  resolvers, 
  schemaDirectives: { ...SchemaDirective, find, all } 
})

```

As you can see, this is done very simply!

---

You can also destructure SchemaDirective and include directives separately.

Its contents: 
```JavaScript
SchemaDirective: {
  hasMany: HasManyDirective,
  hasOne: HasOneDirective,
  belongsTo: BelongsToDirective,
}
```
Use of separate directives:
```JavaScript
/* ... */
const { 
  TypeDefsDirective,
  SchemaDirective: { belongsTo } 
} = require('apollo-server-adonis-relationships')

makeExecutableSchema({ 
  /* ... */ 
  schemaDirectives: { belongsTo, /* ... */} 
})
```

# Further development

add directive:
  - Query
    - all
    - find