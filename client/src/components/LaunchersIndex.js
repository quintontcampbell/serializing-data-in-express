import React, { useState, useEffect } from "react"

import LauncherTile from "./LauncherTile"

const LaunchersIndex = (props) => {
  const [launchers, setLaunchers] = useState([])

  useEffect(() => {
    fetch("/api/v1/launchers")
      .then(response => response.json())
      .then(launchers => {
        setLaunchers(launchers)
      })
  }, [])

  const launcherTiles = launchers.map((launcher) => {
    return(
      <LauncherTile 
        key={launcher.id} 
        launcher={launcher} 
      />
    )
  })

  return (
    <div>
      <h1>Launchers</h1>
      {launcherTiles}
    </div>
  )
}

export default LaunchersIndex
