const { HasOneDirective, HasOneTypeDefs } = require('./src/directives/relationship/HasOne')
const { HasManyDirective, HasManyTypeDefs } = require('./src/directives/relationship/HasMany')
const { BelongsToDirective, BelongsToTypeDefs } = require('./src/directives/relationship/BelongsTo')
const { AllDirective, AllTypeDefs } = require('./src/directives/query/All')
const { FindDirective, FindTypeDefs } = require('./src/directives/query/Find')
const { CreateDirective, CreateTypeDefs } = require('./src/directives/mutation/Create')
const { CreateManyDirective, CreateManyTypeDefs } = require('./src/directives/mutation/CreateMany')
const { UpdateDirective, UpdateTypeDefs } = require('./src/directives/mutation/Update')
const { DeleteDirective, DeleteTypeDefs } = require('./src/directives/mutation/Delete')


module.exports = {
  SchemaDirective: {
    hasOne: HasOneDirective,
    hasMany: HasManyDirective,
    belongsTo: BelongsToDirective,
    all: AllDirective,
    find: FindDirective,
    create: CreateDirective,
    createMany: CreateManyDirective,
    update: UpdateDirective,
    delete: DeleteDirective
  },
  TypeDefsDirective: [
    HasOneTypeDefs,
    HasManyTypeDefs,
    BelongsToTypeDefs,
    AllTypeDefs,
    FindTypeDefs,
    CreateTypeDefs,
    CreateManyTypeDefs,
    UpdateTypeDefs,
    DeleteTypeDefs
  ]
}