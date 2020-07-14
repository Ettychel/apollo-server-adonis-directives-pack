# Apollo-server-adonis-directives-pack

This package complements apollo-server-adonis with communication directives, namely HasOne, HasMany, BelongsTo.

---

# Install

npm i apollo-server-adonis-directives-pack

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

const { TypeDefsDirective, SchemaDirective } = require('apollo-server-adonis-directives-pack')

module.exports = makeExecutableSchema({ 
  typeDefs: [typeDefs, ...TypeDefsDirective],
  resolvers, 
  schemaDirectives: { ...SchemaDirective, find, all } 
})

```
When you add TypeDefsDirective to the schema, you declare directives.
This is how directives and their arguments are declared:

```GraphQL
directive @hasOne(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColomn = 'id'
  ownerColomn: String,
  # By default localColomn = 'id'
  localColomn:String) on FIELD_DEFINITION

directive @hasMany(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColomn = 'id'
  ownerColomn: String,
  # By default localColomn = 'id'
  localColomn:String) on FIELD_DEFINITION

directive @belongsTo(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColomn = 'id'
  ownerColomn: String,
  # By default localColomn = 'id'
  localColomn:String) on FIELD_DEFINITION
  
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
} = require('apollo-server-adonis-directives-pack')

makeExecutableSchema({ 
  /* ... */ 
  schemaDirectives: { belongsTo, /* ... */} 
})
```
---
Usage in schema:
```GraphQL
type User {
  id: ID!
  name: String
  posts: [Post] @hasMany(ownerColomn: "user_id")
  token: Token @hasOne(ownerColomn: "user_id")
}

type Post {
  id: ID!
  user_id: Int
  user: User @belongsTo(localColomn: "user_id")
}

type Token {
  user_id: Int!
  token: String!
  user: User @belongsTo(localColomn: "user_id")
}

```


# Further development

add directive:
  - Query
    - all
    - find