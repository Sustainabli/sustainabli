import React from 'react';
import SashChart from './components/SashChart/SashChart';

import CPMChart from './components/CPMChart/CPMChart';
import './App.scss';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <SashChart />
        <CPMChart />
      </div>
    );
  }
}

export default App;
