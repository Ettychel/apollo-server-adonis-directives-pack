const { SchemaDirectiveVisitor } = require('graphql-tools')
const Loader = require('../Traits/Loader')

class BelongsToDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field) {
    const loader = this.getLoader(this)
    const localColomn = this.getLocalColomn()

    field.resolve = async function (item) {
      return loader.load(item[localColomn])
    }
  }

  _sort(keys, rows, field) {
    return keys.map(id => this.mapping(id, rows, field))
  }

  mapping(id, rows, field) {
    let relation = rows.filter(r => r[field] === id).map(r => r.toJSON())
    if (relation.lenght > 1)
      return relation
    else
      return relation[0]
  }
}

const BelongsToTypeDefs = `directive @belongsTo(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColomn = 'id'
  ownerColomn: String,
  # By default localColomn = 'id'
  localColomn:String) on FIELD_DEFINITION`

Object.assign(BelongsToDirective.prototype, Loader)

module.exports = { BelongsToDirective, BelongsToTypeDefs }