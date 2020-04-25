import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Sim from './app/sim/Sim'
import Calc from './app/calc/Calc'

import Container from './common/components/Container/Container'
import NavigationBar from './common/components/NavigationBar/NavigationBar'

class App extends Component {
  render() {
    return (
      <Container className="App">
        <NavigationBar label="WebOrrery" />
          {/* <Sim /> */}
          <Route exact path="/" component={Sim} />
          <Route exact path="/calc" component={Calc} />
      </Container>
    )
  }
}

export default App
