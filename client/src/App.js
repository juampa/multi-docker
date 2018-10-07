import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Fib from './Fib'
import OtherPage from './OtherPage'

import { BrowserRouter as Router, Route, Link} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Fib Calculator</h1>
            <Link to="/">Home</Link>
            <Link to="/other">Other Page</Link>
          </header>
          <div>
            <Route exact path="/" component={Fib} />
            <Route path="/other" component={OtherPage} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
