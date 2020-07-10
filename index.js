const { HasOneDirective, HasOneTypeDefs } = require('./src/directives/loaders/HasOne')
const { HasManyDirective, HasManyTypeDefs } = require('./src/directives/loaders/HasMany')
const { BelongsToDirective, BelongsToTypeDefs } = require('./src/directives/loaders/BelongsTo')

module.exports = {
  SchemaDirective: {
    hasMany: HasManyDirective,
    hasOne: HasOneDirective,
    belongsTo: BelongsToDirective,
  },
  TypeDefsDirective: [
    HasOneTypeDefs,
    HasManyTypeDefs,
    BelongsToTypeDefs
  ]
}