import React from 'react';

import CFMChart from './components/CFMChart/CFMChart';
import SashChart from './components/SashChart/SashChart';
import './App.scss';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <SashChart />
        <CFMChart />
      </div>
    );
  }
}

export default App;
