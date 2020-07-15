const { GraphQLError } = require('graphql')
const DataLoader = require('dataloader')
const _ = use('lodash')


module.exports = {
  getLoader(parentThis) {
    let model = this.getModel(parentThis)
    let colomn = this.getOwnerColomn(parentThis)
    return this.createLoader(model, colomn)
  },

  createLoader(Model, colomn) {
    let batchLoadFn = (keys) => {
      return Model
        .query()
        .whereIn(colomn, _.uniq(keys))
        .fetch()
        .then(({ rows }) => this._sort(keys, rows, colomn))
    }
    return new DataLoader(batchLoadFn, { cache: false })
  },

  getOwnerColomn() {
    const ownerColomn = this.args.ownerColomn
    if (ownerColomn) return ownerColomn
    else return 'id'
  },

  getLocalColomn() {
    if (this.args.localColomn) return this.args.localColomn
    else return 'id'
  },

  getNameModel({ args: { model }, visitedType: { astNode: { type } } }) {
    let name
    if (model)
      name = model
    else
      name = this.getNameModelInAstNode(type)
    return name
  },

  getNameModelInAstNode(type) {
    const prefix = 'App/Models/'
    if (type.kind === 'NonNullType' || type.kind === 'ListType')
      return this.getNameModelInAstNode(type.type)
    else if (type.kind === 'NamedType')
      return prefix + type.name.value
    else
      throw new Error('Oops!')
  },

  getModel(parentThis) {
    const model = this.getNameModel(parentThis)
    try {
      return use(model)
    } catch (e) {
      throw new GraphQLError(e)
    }
  },

  _getTypeIgnoreNonNull(type) {
    if (type.kind === 'NonNullType')
      return this._getTypeIgnoreNonNull(type.type)
    else
      return type.kind
  },

  _checkReqArgs(field) {
    const argsM = field.args.map(e => e.name)
    const diff = _.difference(this._argumentArr, argsM)

    if (diff.length) throw new Error('One or more of the required arguments not found (' + diff.join(', ') + ')')
  }
}