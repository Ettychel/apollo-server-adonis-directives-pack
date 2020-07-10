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
    let name
    if (type.kind === 'ListType')
      name = type.type.name.value
    else if (type.kind === 'NamedType')
      name = type.name.value
    else
      throw new Error('Oops!')
    return 'App/Models/' + name
  },

  getModel(parentThis) {
    const model = this.getNameModel(parentThis)
    try {
      return use(model)
    } catch (e) {
      throw new GraphQLError(e)
    }
  }
}