const { SchemaDirectiveVisitor } = require('graphql-tools')
const { getModel, getNameModel, getNameModelInAstNode } = require('../Traits/Loader')

class AllDirective extends SchemaDirectiveVisitor {

  visitFieldDefinition(field) {
    const Model = this.getModel(this)

    field.resolve = async function () {
      const res = await Model.all()
      return res.toJSON()
    }
  }
}

const AllTypeDefs = `# returns a collection of all models of this specified return type
directive @all on FIELD_DEFINITION `

Object.assign(AllDirective.prototype, { getModel, getNameModel, getNameModelInAstNode })

module.exports = { AllDirective, AllTypeDefs }