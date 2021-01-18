const Launcher = require("./Launcher")
const Model = require("./Model")

class DankMeme extends Model {
  static get tableName() {
    return "dankMemes"
  }

  static get relationMappings(){
    return {
      launcher: {
        relation: Model.BelongsToOneRelation,
        modelClass: Launcher,
        join: {
          from: "dankMemes.launcherId",
          to: "launchers.id"
        }
      }
    }
  }
}

module.exports = DankMeme