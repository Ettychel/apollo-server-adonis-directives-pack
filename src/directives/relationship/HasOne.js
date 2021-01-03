const BaseDirective = require('../BaseDirective')

class HasOneDirective extends BaseDirective {

  visitFieldDefinition(field) {
    const loader = this._getLoader(this)
    const localColomn = this._getLocalColomn(this)

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

module.exports = { HasOneDirective, HasOneTypeDefs }