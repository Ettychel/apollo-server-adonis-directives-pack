const { SchemaDirectiveVisitor } = require('graphql-tools')
const Loader = require('../Traits/Loader')

class HasManyDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field) {
    const loader = this.getLoader(this)
    const localColomn = this.getLocalColomn()

    field.resolve = async function (item) {
      return loader.load(item[localColomn])
    }
  }

  _sort(keys, rows, colomn) {
    return keys.map(id => rows.filter(r => r[colomn] === id).map(r => r.toJSON()))
  }
}

const HasManyTypeDefs = `directive @hasMany(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColomn = 'id'
  ownerColomn: String,
  # By default localColomn = 'id'
  localColomn:String) on FIELD_DEFINITION`

Object.assign(HasManyDirective.prototype, Loader)

module.exports = { HasManyDirective, HasManyTypeDefs }