import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DemoPage from './components/DemoPage/DemoPage';
import HomePage from './components/HomePage/HomePage';
import LabPage from './components/LabPage/LabPage';
import NavDrawer from './components/NavDrawer/NavDrawer';
import TeamPage from './components/TeamPage/TeamPage';
import { LAB_NAMES } from './utils/Constants';
import './App.scss';

class App extends React.Component {
  render() {
    return (
      <Container className='App' fluid>
        <Row className='root-row'>
          <Col md={2} className='navdrawer-col'>
            <NavDrawer />
          </Col>
          <Col md={10} className='root-right-col'>
            <BrowserRouter>
              <Routes>
                <Route exact path='/' element={<HomePage />} />
                {LAB_NAMES.map((lab) => (
                  <Route
                    exact
                    path={`/${lab}`}
                    element={<LabPage lab={lab} />}
                    key={lab}
                  />
                ))}
                <Route exact path='/team' element={<TeamPage />} />
                <Route exact path='/demo' element={<DemoPage />} />
                <Route path='/*' element={<Navigate to='/' />} />
              </Routes>
            </BrowserRouter>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
