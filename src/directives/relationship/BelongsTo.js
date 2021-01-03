const BaseDirective = require('../BaseDirective')

class BelongsToDirective extends BaseDirective {

  visitFieldDefinition(field) {
    const loader = this._getLoader(this)
    const localColumn = this._getLocalColumn(this)

    field.resolve = async function (item) {
      return loader.load(item[localColumn])
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
  # By default ownerColumn = 'id'
  ownerColumn: String,
  # By default localColumn = 'id'
  localColumn:String) on FIELD_DEFINITION`

module.exports = { BelongsToDirective, BelongsToTypeDefs }