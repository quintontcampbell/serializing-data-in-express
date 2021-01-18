	/* eslint-disable no-await-in-loop, no-restricted-syntax */
  import { Launcher } from "../../models/index.js"
  class LauncherSeeder {
    static async seed() {
      const launchersData = [
        {
          name: "Meredith Grey",
          age: 42,
          encryptedPassword: "15dsa6we"
        },
        {
          name: "Miranda Bailey",
          age: 45,
          encryptedPassword: "9fisa93mf"
        },
        {
          name: "Maggie Pierce",
          encryptedPassword: "asdi9128r"
        }
      ]

      for (const singleLauncherData of launchersData) {
        const currentLauncher = await Launcher.query().findOne({ name: singleLauncherData.name })
        if (!currentLauncher) {
          await Launcher.query().insert(singleLauncherData)
        }
      }
    }
  }

  export default LauncherSeeder