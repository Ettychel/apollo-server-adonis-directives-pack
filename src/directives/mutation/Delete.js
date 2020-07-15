const { SchemaDirectiveVisitor } = require('graphql-tools')
const _ = require('lodash')
const {
  getModel,
  getNameModel,
  getNameModelInAstNode,
  _getTypeIgnoreNonNull,
  _checkReqArgs
} = require('../Traits/Loader')


class DeleteDirective extends SchemaDirectiveVisitor {

  static _argumentArr = ['id']

  visitFieldDefinition(field) {
    const Model = this.getModel(this)
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

Object.assign(DeleteDirective.prototype, {
  getModel,
  getNameModel,
  getNameModelInAstNode,
  _getTypeIgnoreNonNull,
  _checkReqArgs
})

const DeleteTypeDefs = `directive @delete(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String) on FIELD_DEFINITION`

module.exports = { DeleteDirective, DeleteTypeDefs }