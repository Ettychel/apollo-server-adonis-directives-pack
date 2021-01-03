const BaseDirective = require('../BaseDirective')

class HasManyDirective extends BaseDirective {

  visitFieldDefinition(field) {
    const loader = this._getLoader(this)
    const localColumn = this._getLocalColumn(this)

    field.resolve = async function (item) {
      return loader.load(item[localColumn])
    }
  }

  _sort(keys, rows, column) {
    return keys.map(id => rows.filter(r => r[column] === id).map(r => r.toJSON()))
  }
}

const HasManyTypeDefs = `directive @hasMany(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String,
  # By default ownerColumn = 'id'
  ownerColumn: String,
  # By default localColumn = 'id'
  localColumn:String) on FIELD_DEFINITION`

module.exports = { HasManyDirective, HasManyTypeDefs }