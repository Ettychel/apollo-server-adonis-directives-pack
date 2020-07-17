const BaseDirective = require('../BaseDirective')

class DeleteDirective extends BaseDirective {

  visitFieldDefinition(field) {
    const Model = this._getModel(this)
    this._argumentArr = ['id']
    const isOnceDelete = this._checkArguments(field)

    field.resolve = async function (item, { id }) {
      const ids = isOnceDelete ? [id] : id
      const model = Model.query().whereIn(Model.primaryKey, ids)
      const res = await model.fetch()
      await model.delete()
      return isOnceDelete ? res.toJSON()[0] : res.toJSON()
    }
  }

  _checkArguments(field) {
    this._checkReqArgs(field)

    const isOnceId = this._getTypeIgnoreNonNull(field.args.find(({ name }) => name === 'id').astNode.type)
    const isOnceReturn = this._getTypeIgnoreNonNull(field.astNode.type)

    if (isOnceId !== isOnceReturn) throw new Error('Different sets are set for input and output')

    return isOnceId === 'NamedType'
  }
}

const DeleteTypeDefs = `directive @delete(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String) on FIELD_DEFINITION`

module.exports = { DeleteDirective, DeleteTypeDefs }