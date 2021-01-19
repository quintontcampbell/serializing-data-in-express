import express from "express"
import { Launcher } from "../../../models/index.js"
import LauncherSerializer from "../../../serializers/LauncherSerializer.js"

const launchersRouter = new express.Router()

launchersRouter.get("/", async (req, res) => {
  try {
    const launchers = await Launcher.query()
    const allowedAttributes = ["id", "name", "age"]
    const serializedLaunchers = launchers.map(launcher => {
      let serializedLauncher = {}
      for (const attribute of allowedAttributes) {
        serializedLauncher[attribute] = launcher[attribute]
      }
      return serializedLauncher
    })
    return res.status(200).json({ launchers: serializedLaunchers })
  }
  catch(error) {
    return res.status(500).json({ errors: error })
  }
})

export default launchersRouter
