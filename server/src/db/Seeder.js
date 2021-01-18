/* eslint-disable no-console */

import { connection } from "../boot.js"
import LauncherSeeder from "./seeders/LauncherSeeder.js"
import DankMemeSeeder from "./seeders/DankMemeSeeder.js"

class Seeder {
  static async seed() {
    console.log("seeding launchers")
    await LauncherSeeder.seed()

    console.log("seeding dank memes")
    await DankMemeSeeder.seed()

    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder