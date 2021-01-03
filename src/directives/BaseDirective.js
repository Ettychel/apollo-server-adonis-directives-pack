const { SchemaDirectiveVisitor } = require('graphql-tools')
const { GraphQLError } = require('graphql')
const DataLoader = require('dataloader')
const _ = use('lodash')

class BaseDirective extends SchemaDirectiveVisitor {

  _getLoader(parentThis) {
    const model = this._getModel(parentThis)
    const column = this._getOwnerColumn(parentThis)
    return this._createLoader(model, column)
  }

  _createLoader(Model, column) {
    const batchLoadFn = (keys) => {
      return Model
        .query()
        .whereIn(column, _.uniq(keys))
        .fetch()
        .then(({ rows }) => this._sort(keys, rows, column))
    }
    return new DataLoader(batchLoadFn, { cache: false })
  }

  _getOwnerColumn() {
    if (this.args.ownerColumn) return this.args.ownerColumn
    else return 'id'
  }

  _getLocalColumn() {
    if (this.args.localColumn) return this.args.localColumn
    else if (this.name === 'belongsTo')
      return _.toLower(this._getNameModel(this)) + '_id'
    else return 'id'
  }

  _getNameModel({ args: { model }, visitedType: { astNode: { type } } }) {
    let name
    if (model) name = model
    else name = this._getNameModelInAstNode(type)
    return name
  }

  _getNameModelInAstNode(type) {
    if (type.kind === 'NonNullType' || type.kind === 'ListType')
    return this._getNameModelInAstNode(type.type)
    else if (type.kind === 'NamedType')
    return type.name.value
    else
    throw new Error('Oops!')
  }
  
  _getModel(parentThis) {
    const prefix = 'App/Models/'
    const model = this._getNameModel(parentThis)
    try {
      return use(prefix + model)
    } catch (e) {
      throw new GraphQLError(e)
    }
  }

  _getTypeIgnoreNonNull(type) {
    if (type.kind === 'NonNullType')
      return this._getTypeIgnoreNonNull(type.type)
    else
      return type.kind
  }

  _checkReqArgs(field) {
    const argsM = field.args.map(e => e.name)
    const diff = _.difference(this._argumentArr, argsM)

    if (diff.length) throw new Error('One or more of the required arguments not found (' + diff.join(', ') + ')')
  }
}

module.exports = BaseDirective
