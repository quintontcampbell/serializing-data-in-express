import React from "react"

const DankMemeTile = props => {
  const {name, url} = props.meme

  return (
    <div>
      <li>{name}</li>
      <img src={url} />
    </div>
  )
}

export default DankMemeTile
