const { SchemaDirectiveVisitor } = require('graphql-tools')
const Loader = require('../Traits/Loader')

class HasOneDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field) {
    const loader = this.getLoader(this)
    const localColomn = this.getLocalColomn()

    field.resolve = async function (item) {
      return loader.load(item[localColomn])
    }
  }

  _sort(keys, rows, field) {
    return keys.map(id => {
      let row = rows.find(r => r[field] === id)
      if (row) row = row.toJSON()
      return row
    })
  }
}

const HasOneTypeDefs = `directive @hasOne(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColomn = 'id'
  ownerColomn: String,
  # By default localColomn = 'id'
  localColomn:String) on FIELD_DEFINITION`

Object.assign(HasOneDirective.prototype, Loader)

module.exports = { HasOneDirective, HasOneTypeDefs }