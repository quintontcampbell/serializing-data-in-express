	/* eslint-disable no-await-in-loop, no-restricted-syntax */
  import { DankMeme } from "../../models/index.js"

  class DankMemeSeeder {
    static async seed() {
      const dankMemesData = [
        {
          name: "Stages of watching Grey's",
          url: "https://i.pinimg.com/originals/23/0c/fe/230cfe4fb172c38a6babe7881365c410.jpg",
          launcherId: 1
        },
        {
          name: "Trust me...I'm a doctor",
          url: "https://quotesdaily.net/wp-content/uploads/2017/07/1501267199_575_best-funny-quotes-25-funny-greys-anatomy-memes.jpg",
          launcherId: 1
        },
        {
          name: "Grey's Excitement",
          url: "https://imgix.bustle.com/uploads/image/2020/2/7/94048193-ba38-477b-a445-f420072fbe96-baileymeme.jpg",
          launcherId: 2
        }
      ]

      for (const singleDankMemeData of dankMemesData) {
        const currentDankMeme = await DankMeme.query().findOne({ name: singleDankMemeData.name })
        if (!currentDankMeme) {
          await DankMeme.query().insert(singleDankMemeData)
        }
      }
    }
  }

  export default DankMemeSeeder