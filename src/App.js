import React, { Component } from 'react';
import Board from './Board';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {currentCount: 0}
  }

  timer() {
    this.setState({
      currentCount: this.state.currentCount + 1
    })
    // if (this.state.currentCount  1) { 
    //   clearInterval(this.intervalId);
    // }
  }
  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 1000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '420px' }}>
        <Board tick={this.state.currentCount} />
      </div>
    );
  }
}

export default App;
