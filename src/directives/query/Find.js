const BaseDirective = require("../BaseDirective");

class FindDirective extends BaseDirective {
  visitFieldDefinition(field) {
    const Model = this._getModel(this);
    this._argumentArr = ["id"];

    this._checkArguments(field);

    field.resolve = async function (_, { id }) {
      const res = await Model.find(id);
      try {
        return res.toJSON();
      } catch {
        return [];
      }
    };
  }

  _checkArguments(field) {
    this._checkReqArgs(field);

    const kind = this._getTypeIgnoreNonNull(
      field.args.find((e) => e.name === "id").astNode.type
    );
    if (kind !== "NamedType")
      throw new Error("The id argument cannot be an array");
  }
}

const FindTypeDefs = `directive @find(
  # By default, the model will be calculated from the name
  # of the returned "type" with the prefix 'App/Model/'
  model: String
  ) on FIELD_DEFINITION`;

module.exports = { FindDirective, FindTypeDefs };
