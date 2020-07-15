const { SchemaDirectiveVisitor } = require('graphql-tools')
const { 
  getModel, 
  getNameModel, 
  getNameModelInAstNode, 
  _getTypeIgnoreNonNull, 
  _checkReqArgs 
} = require('../Traits/Loader')


class UpdateDirective extends SchemaDirectiveVisitor {

  static _argumentArr = [
    'id',
    'input'
  ]

  visitFieldDefinition(field) {
    const Model = this.getModel(this)
    const isOnceUpdate = this._checkArguments(field)

    if (isOnceUpdate) {
      field.resolve = async function (item, { id, input }) {
        const model = await Model.find(id)
        if (model === null) return null
        model.merge(input)
        model.save()
        return model.toJSON()
      }
    } else {
      field.resolve = async function (item, { id, input }) {
        await Model.query().whereIn(Model.primaryKey, id).update(input)
        const res = await Model.query().whereIn(Model.primaryKey, id).fetch()
        return res.toJSON()
      }
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

Object.assign(UpdateDirective.prototype, { 
  getModel, 
  getNameModel, 
  getNameModelInAstNode, 
  _getTypeIgnoreNonNull, 
  _checkReqArgs 
})

const UpdateTypeDefs = `directive @update(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String) on FIELD_DEFINITION`

module.exports = { UpdateDirective, UpdateTypeDefs }