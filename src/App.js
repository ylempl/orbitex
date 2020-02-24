import React, { Component } from 'react'
// import { Route } from 'react-router-dom'

import Sim from './app/sim/Sim'

import Container from './common/components/Container/Container'
import NavigationBar from './common/components/NavigationBar/NavigationBar'

class App extends Component {
  render() {
    return (
      <Container className="App">
        <NavigationBar label="Orbitex" />
          <Sim />
          {/* <Route exact path="/" component={Sim} /> */}
          {/* <Route exact path="/add" render={(props) => <CharacterFormView {...props} isEdit={false} />}/> */}
      </Container>
    )
  }
}

export default App
