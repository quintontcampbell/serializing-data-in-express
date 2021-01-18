import React from "react"

import DankMemeTile from "./DankMemeTile"

const LauncherTile = props => {
  const {name, age, dankMemes} = props.launcher
  const firstName = name.split(" ")[0]

  let dankMemeTiles 
  if(dankMemes) {
    dankMemeTiles = dankMemes.map(meme => {
      return (
        <DankMemeTile
          key={meme.id}
          meme={meme}
        />
      )
    })
  }

  return (
    <div>
      <h3>{name}, {age}</h3>
      <h4>{firstName}'s Memes:</h4>
      <ul>
        {dankMemeTiles}
      </ul>
    </div>
  )
}

export default LauncherTile
