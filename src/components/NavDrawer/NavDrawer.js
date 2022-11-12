import React, { useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import {
  Drawer,
  DrawerNavigationHeader,
  DrawerOverflow,
  DrawerToC,
  DrawerToggle,
} from 'react-bootstrap-drawer';
import { LAB_NAMES } from '../../utils/Constants.js';
import { capitalizeString } from '../../utils/Utils';
import 'react-bootstrap-drawer/lib/style.css';
import './NavDrawer.scss';

function NavDrawer() {
  const [open, setOpen] = useState(true);

  const handleToggle = () => setOpen(!open);

  return (
    <Drawer>
      <DrawerToggle onClick={handleToggle} />
      <Collapse in={open}>
        <DrawerOverflow>
          <DrawerToC>
            <DrawerNavigationHeader href='/'>
              <h3>Sustainabli</h3>
            </DrawerNavigationHeader>
            <Nav.Item>
              <Nav.Link href='/'>Home</Nav.Link>
            </Nav.Item>
            {/*
            <Nav.Item>
              <Nav.Link href="/impact">Impact</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/goals">Goals</Nav.Link>
            </Nav.Item>
            */}
            <Nav.Item>
              <Nav.Link href='/team'>Our Team</Nav.Link>
            </Nav.Item>
            {/*
            <Nav.Item>
              <Nav.Link href="/notices">Notices</Nav.Link>
            </Nav.Item>
            */}
            <hr />
            <h4 className='labs-header'> Labs </h4>
            {LAB_NAMES.map((lab) => (
              <Nav.Item key={lab}>
                <Nav.Link href={`/${lab}`}>{capitalizeString(lab)}</Nav.Link>
              </Nav.Item>
            ))}
            <br/>
            <Nav.Item>
              <Nav.Link href='/profile'>Profile</Nav.Link>
            </Nav.Item>
          </DrawerToC>
        </DrawerOverflow>
      </Collapse>
    </Drawer>
  );
}

export default NavDrawer;
