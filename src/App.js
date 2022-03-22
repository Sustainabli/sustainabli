import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Modal from 'react-bootstrap/Modal';
import Toggle from 'react-toggle'
import "react-toggle/style.css"

import SashChart from './components/SashChart/SashChart';
import './App.scss';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <SashChart/>
      </div>
    );
  }
}

export default App;
