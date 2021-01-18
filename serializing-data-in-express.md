We've learned how to send simple JSON responses from Express routes, but our database and its associations have gotten more complex since then! We've added logic to show associated data within our routers, but we know that that's not best practice as it doesn't truly adhere to the Single Responsibility Principle. Let's see how we can extract this associated data logic to its own object, as well as modify the data to filter out unnecessary attributes!

### Learning Goals

* Understand the role of serialization in making our data accessible
* Build a serializer class to select visible attributes and display associated data

### Getting Started

```no-highlight
et get serializing-data-in-express
cd serializing-data-in-express
createdb serializing_launchers_development
yarn install

cd server
yarn run migrate:latest
yarn run db:seed

cd ..
yarn run dev
```

We've provided an app for keeping track of our Launchers and their favorite memes! Currently, we have a migration and model set up to see a list of Launchers, and an additional migration and model for their `dankMeme`s. We also have a React frontend calling on an Express backend to render our pages. If you navigate to <http://localhost:3000>, you'll see a page with a simple header and a list of some of our favorite doctors.

## What's Serialization?

Let's look at the simple Express endpoint we have set up:

```javascript
// server/src/routes/api/v1/launchersRouter.js

launchersRouter.get("/", async (req, res) => {
  try {
    const launchers = await Launcher.query()
    return res.status(200).json({ launchers: launchers })
  }
  catch(error) {
    return res.status(500).json({ errors: error })
  }
})
```

Navigate to <http://localhost:3000/api/v1/launchers> to see the data being output at this API endpoint. We'll notice that we're getting all of this launcher's information -- including the timestamps from our database, as well as the user's `encryptedPassword`. Eek! We probably don't want to share that information with the world! (Even though the password is encrypted, it's still [a major security issue][password-leaks] if that information gets leaked.)

Moreover, if we look at our React page again, we can confirm that we _do not need_ all of this information for our page. We only need the `name` and `age` of the Launcher. We'll also notice that we have a section for each Launcher's memes....but we don't yet have anything showing up under this section! While we've displayed associated records inside our API endpoints before, we've mostly kept that to "show" pages where we're only looking at one "parent" record. But it would be nice to have a way to neatly get associated records for an entire _array_ of parent records (as we show with our index page of Launchers and their related DankMemes here).

**Serializers** can handle this "pruning" of our data. Whenever we want to display data that's _different_ from our full record, serializers can help us remove or add related data for serving up in our API endpoint. Serializers are a special class that we build to either remove/disallow certain attributes of a record, or to add related records. Let's first create a serializer to help us hide the attributes we don't need.

### Disallowing Attributes

In order to hide our unnecessary timestamps and to protect our `encryptedPassword`, let's explicitly specify the attributes that we want to send along:

```javascript
// server/src/routes/api/v1/launchersRouter.js

launchersRouter.get("/", await (req, res) => {
  try {
    const launchers = await Launcher.query()

    const allowedAttributes = ["id", "name", "age"] // no encryptedPassword here!
    const serializedLaunchers = launchers.map(launcher => {
      let serializedLauncher = {}
      for (const attribute of allowedAttributes) {
        serializedLauncher[attribute] = launcher[attribute]
      }

      return serializedLauncher
    })

    // Be sure to update this line to respond with our newly defined serializedLaunchers, like so:
    return res.status(200).json({ launchers: serializedLaunchers })
  }
  catch(error) {
    return res.status(500).json({ errors: error })
  }
})
```

Nice! Now we can ensure that we're only passing along the attributes that we intend to. This approach lets us avoid exposing sensitive information. It also allows us to keep the amount of data that we're transmitting in the request small -- the more information we have to transmit, the more slowly our app will run. Note that we're still including our `id`, so that React can continue to use it as a `key` in any `.map()` calls.

So far, we've achieved our desired outcome, but we're not adhering to the _Single Responsibility Principle_ -- instead, our router(/controller) is responsible for both processing our request and response _and_ doing our serialization logic. To clean this up, let's abstract this logic into a custom class -- this will help us avoid repeating ourselves if we need to use the same serialization at multiple endpoints, and it will also ensure that our controller isn't taking on too many different responsibilities. Add a directory and file such that you have a `server/src/serializers/LauncherSerializer.js` and place the following code inside:

```javascript
// server/src/serializers/LauncherSerializer.js

// the responsibility of this class is to prepare data in different ways for API endpoints
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
```

We're calling this function `getSummary` because we want to return a summary of the Launcher. Now we can rewrite the route in our `launchersRouter` as:

```javascript
// server/src/routes/api/v1/launchersRouter.js

import LauncherSerializer from "../../../serializers/LauncherSerializer.js"

...

launchersRouter.get("/", async (req, res) => {
  try {
    const launchers = await Launcher.query()

    const serializedLaunchers = launchers.map(launcher => LauncherSerializer.getSummary(launcher))

    return res.status(200).json({ launchers: serializedLaunchers })
  }
  catch(error) {
    return res.status(500).json({ errors: error })
  }
})
```

Revisit <http://localhost:3000/api/v1/launchers> and you should see some nicely pared-down data which leaves out the timestamps and `encryptedPassword`. If we look at our React page, we'll see everything rendering as it already was! Omitting this data can both protect our user information _and_ speed up our fetch call, without altering the user's experience.

### Including Associations

Of course, we want to be able to use serializers to affect the user's experience as well. In this app, we can do so by using our serializer to show related records.

In the past, we've shown related records for a given parent records by running a `$relatedQuery` directly in our API endpoint. This looked something like the below (sample) "show" API endpoint:

```js
launchersRouter.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const launcher = await Genre.query().findById(id)
    launcher.dankMemes = await launcher.$relatedQuery("dankMemes")
    return res.status(200).json({ launcher: launcher })
  } catch(error){
    return res.status(500).json({ errors: error })
  }
})
```

This worked! However, as we've mentioned, it didn't _truly_ adhere to the Single Responsibility Principle, as our router is now becoming responsible for receiving a request and return a response _as well as_ querying for data, querying for associated data, and formatting it all into one nested object. In a "show" endpoint, we can get away with this, but as we want to display an index page with nested data, it gets more and more complicated. Like we did with our formatting for allowed attributes, we know there's a way to extract this logic -- by putting it into our serializer!

Here, a launcher `has many` dankMemes, and we want to transmit those dank memes as part of each Launcher object so that we can show them on our page. We could update our serializer like so:

```javascript
// server/src/serializers/LauncherSerializer.js

class LauncherSerializer {
  static async getSummary(launcher) {
    const allowedAttributes = ["id", "name", "age"]
    let serializedLauncher = {}
    for (const attribute of allowedAttributes) {
      serializedLauncher[attribute] = launcher[attribute]
    }
    serializedLauncher.dankMemes = await launcher.$relatedQuery("dankMemes")
    return serializedLauncher
  }
}

export default LauncherSerializer
```

Note that our function is now asynchronous, because of the database query! Let's update the controller accordingly to `await` this asynchronous function appropriately:

```javascript
// server/src/routes/api/v1/launchersRouter.js

launchersRouter.get("/", async (req, res) => {
  try {
    const launchers = await Launcher.query()

    const serializedLaunchers = []

    for (const launcher of launchers) {
      const serializedLauncher = await LauncherSerializer.getSummary(launcher)
      serializedLaunchers.push(serializedLauncher)
    }

    return res.status(200).json({ launchers: serializedLaunchers })
  }
  catch(error) {
    return res.status(500).json({ errors: error })
  }
})
```

Take a look at our API endpoint now. We'll see that a `dankMemes` key has appeared, with a value of an array of `dankMeme` objects! If we now go back to our React page at <http://localhost:3000>, we'll see our memes appear on our page.

#### A Brief Note on Serializing Associated Data

You'll notice that our API endpoint is serializing our Launchers quite nicely, but our Dank Memes are still showing timestamps, etc as they have not been serialized.

Should we want to serialize our nested data, we would want to first create a `DankMemeSerializer`. Then, within our `LauncherSerializer`, we would use that Serializer when attaching memes to our Launcher:

```javascript
// server/src/serializers/LauncherSerializer.js

import DankMemeSerializer from "./DankMemeSerializer.js"

class LauncherSerializer {
  static async getSummary(launcher) {
    const allowedAttributes = ["id", "name", "age"]
    let serializedLauncher = {}
    for (const attribute of allowedAttributes) {
      serializedLauncher[attribute] = launcher[attribute]
    }
    const relatedDankMemes = await launcher.$relatedQuery("dankMemes")
    const serializedDankMemes = relatedDankMemes.map(meme => DankMemeSerializer.getSummary(meme))
    serializedLauncher.dankMemes = serializedDankMemes
    return serializedLauncher
  }
}

export default LauncherSerializer
```

### Why This Matters

When creating our API endpoints, it is important to be thoughtful about the data we're sending. For both efficiency and security reasons, we may want to disallow specific attributes so that we're not sending secure _or_ unnecessary data. Additionally, there are times when we may want to add data to our endpoint: specifically, we'll often need to add associated records. Using Serializers allows us to finesse our data for our endpoint, while abstracting the logic to a separate class to adhere to the Single Responsibility Principle.

### In Summary

In this article, we've written our first serializer class in order to format data for a particular API endpoint. We defined a static method, `getSummary`, to provide the data formatted for a summary page. This method makes sure we have all necessary data, and _only_ the necessary data, needed for a particular page in our app.

It is possible that we will need our data to be formatted in different ways for different pages. For example, if we had information like the address and birthday of our Launchers, we could have a Launcher _show_ page where we include more details about the Launcher. This would require an additional method in order to format the data for that page, differently than we did for our homepage.

By defining custom serializer classes with individual methods inside, we're able to keep all the logic related to a particular model's serialization in one place! This also allows us to protect our controller from needing to take on the responsibility of massaging our data into the format we want for transmission in an HTTP response.

[password-leaks]: https://www.theguardian.com/technology/2013/nov/07/adobe-password-leak-can-check