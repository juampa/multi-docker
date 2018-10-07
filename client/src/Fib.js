import React, { Component } from 'react'
import axios from 'axios'

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {
    },
    index: ''
  }

  componentDidMount() {
    this.fetchValues()
    this.fetchIndexes()
  }

  async fetchValues() {
    const { data: values } = await axios.get('/api/values/current')
    this.setState({ values })
  }

  async fetchIndexes() {
    const { data: seenIndexes } = await axios.get('/api/values')
    this.setState({ seenIndexes })
  }

  renderSeenIndexes() {
    const { seenIndexes } = this.state
    return seenIndexes.map(({ number }) => number).join(', ')
  }

  renderValues() {
    const { values } = this.state

    return Object.keys(values).map( k => (
      <div key={k}>
        Index: {k} | Fib Value: {values[k]}
      </div>
    ))
  }

  handleSubmit = async (e) => {
    const { index } = this.state
    e.preventDefault()

    await axios.post('/api/values', { index })
    this.setState(prevState => ({index: ''}))
  }

  render() {
    const { index } = this.state

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index</label>
          <input
            onChange={(e) => this.setState({index: e.target.value})}
            value={index}
          />
          <button>Submit</button>
        </form>
        <div>
          <h3>Seen Indexes</h3>
          { this.renderSeenIndexes() }
        </div>
        <div>
          <h3>Calculated Values</h3>
          { this.renderValues() }
        </div>
      </div>
    )
  }
}

export default Fib
