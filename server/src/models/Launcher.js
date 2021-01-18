const DankMeme = require("./DankMeme")
const Model = require("./Model")

class Launcher extends Model {
  static get tableName() {
    return "launchers"
  }

  static get relationMappings() {
    return {
      dankMemes: {
        relation: Model.HasManyRelation,
        modelClass: DankMeme,
        join: {
          from: "launchers.id",
          to: "dankMemes.launcherId"
        }
      }
    }
  }
}

module.exports = Launcher