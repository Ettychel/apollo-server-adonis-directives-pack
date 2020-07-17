const BaseDirective = require('../BaseDirective')

class AllDirective extends BaseDirective {

  visitFieldDefinition(field) {
    const Model = this._getModel(this)

    field.resolve = async function () {
      const res = await Model.all()
      return res.toJSON()
    }
  }
}

const AllTypeDefs = `# returns a collection of all models of this specified return type
directive @all on FIELD_DEFINITION `

module.exports = { AllDirective, AllTypeDefs }