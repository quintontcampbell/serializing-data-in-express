import { Launcher } from "../models"

class LauncherSerializer {
  static getSummary(launcher) {
    const allowedAttributes = ["id", "name", "age"]
    let serializedLauncher = {}
    for (const attribute of allowedAttributes) {
      serializedLauncher[attribute] = launcher[attribute]
    }
    return serializedLauncher
  }
}

export default LauncherSerializer