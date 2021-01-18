import React from "react"
import { hot } from "react-hot-loader/root"
import { BrowserRouter, Route } from "react-router-dom"
import LaunchersIndex from "./LaunchersIndex"

import "../assets/scss/main.scss"

const App = props => {
  return (
    <BrowserRouter>
      <Route path="/" component={LaunchersIndex} />
    </BrowserRouter>
  )
}

export default hot(App)
