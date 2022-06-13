import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LabPage from './components/LabPage/LabPage';
import { NavDrawer } from './components/NavDrawer/NavDrawer';
import { LAB_NAMES } from './utils/Constants';
import './App.scss';

class App extends React.Component {
  render() {
    return (
      <Container className='App' fluid>
        <Row className='root-row'>
          <Col as={NavDrawer} md={2} />
          <Col md={10} className='root-right-col'>
            <BrowserRouter>
              <Routes>
                <Route exact path='/' element={<HomePage />} />
                <Route path='/*' element={<Navigate to='/' />} />
                {Object.values(LAB_NAMES)
                  .filter((lab) => lab !== LAB_NAMES.all)
                  .map((lab) => (
                    <Route
                      exact
                      path={`/${lab}`}
                      element={<LabPage lab={lab} />}
                      key={lab}
                    />
                  ))}
              </Routes>
            </BrowserRouter>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
