import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../Header/Header';
import InfoModal from '../InfoModal/InfoModal';

import './Admin.scss';

class Admin extends React.Component {
    render() {
        return (
            <Container fluid className='HomePage'>
                <InfoModal />
            </Container>
        );
    }
}

export default Admin;
