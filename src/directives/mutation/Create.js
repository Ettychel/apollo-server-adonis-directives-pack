const { SchemaDirectiveVisitor } = require('graphql-tools')
const { getModel, getNameModel, getNameModelInAstNode, _getTypeIgnoreNonNull, _checkReqArgs } = require('../Traits/Loader')


class CreateDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field) {
    const Model = this.getModel(this)
    this._argumentArr = ['input']
    
    this._checkArguments(field)

    field.resolve = async function (item, { input }) {
      const res = await Model.create(input)
      return res.toJSON()
    }
  }

  _checkArguments(field) {
    this._checkReqArgs(field)

    const kind = this._getTypeIgnoreNonNull(field.args.find(e => e.name === 'input').astNode.type)
    if (kind !== 'NamedType') throw new Error('The @create directive only accepts a single input, not an array')

    const returnType = this._getTypeIgnoreNonNull(field.astNode.type)
    if (returnType !== 'NamedType') throw new Error('The @create directive returns only one model, not an array')
  }
}

Object.assign(CreateDirective.prototype, { getModel, getNameModel, getNameModelInAstNode, _getTypeIgnoreNonNull, _checkReqArgs })

const CreateTypeDefs = `directive @create(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String) on FIELD_DEFINITION`

module.exports = { CreateDirective, CreateTypeDefs }