import express from "express"
import { Launcher } from "../../../models/index.js"

const launchersRouter = new express.Router()

launchersRouter.get("/", async (req, res) => {
  try {
    const launchers = await Launcher.query()
    return res.status(200).json({ launchers: launchers })
  }
  catch(error) {
    return res.status(500).json({ errors: error })
  }
})

export default launchersRouter
