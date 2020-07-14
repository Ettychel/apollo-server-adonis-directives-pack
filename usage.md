# Usage

## Exported Objects

The package provides an object with directive classes and an array with GraphQL schemes:

SchemaDirective - object with directive classes  
TypeDefsDirective - array with GraphQL schemes

Complete your schema configuration with these objects.  
This is an example of how I do it in my projects:

```javascript
const { makeExecutableSchema } = require('graphql-tools')
const fs = require('fs')
const typeDefs = fs.readFileSync(__dirname + '/types.graphql', { encoding: 'utf8' })
const resolvers = require('./resolvers.js')
const { find, all } = require('./directives')

const { 
  TypeDefsDirective, 
  SchemaDirective 
} = require('apollo-server-adonis-directives-pack')

module.exports = makeExecutableSchema({ 
  typeDefs: [typeDefs, ...TypeDefsDirective],
  resolvers, 
  schemaDirectives: { ...SchemaDirective, find, all } 
})
```

{% hint style="info" %}
The example above shows that the scheme is expanded using the package, and is not the main source
{% endhint %}

You can also destructure SchemaDirective and include directives separately.

Use of separate directives:

```javascript
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

### Usage in schema

Use directives in the usual way in your circuits:

```graphql
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

For details on each directive, see the API description.

