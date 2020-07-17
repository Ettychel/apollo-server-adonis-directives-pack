const BaseDirective = require('../BaseDirective')

class CreateManyDirective extends BaseDirective {

  visitFieldDefinition(field) {
    const Model = this._getModel(this)
    this._argumentArr = ['input']

    this._checkArguments(field)

    field.resolve = async function (item, { input }) {
      const res = await Model.createMany(input)
      return res.toJSON()
    }
  }

  _checkArguments(field) {
    this._checkReqArgs(field)

    const kind = this._getTypeIgnoreNonNull(field.args.find(e => e.name === 'input').astNode.type)
    if (kind !== 'ListType') throw new Error('The @create directive only accepts an array of models')
    
    const returnType = this._getTypeIgnoreNonNull(field.astNode.type)
    if (returnType !== 'ListType') throw new Error('The @create directive only returns an array of models')
  }
}

const CreateManyTypeDefs = `directive @createMany(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String) on FIELD_DEFINITION`

module.exports = { CreateManyDirective, CreateManyTypeDefs }