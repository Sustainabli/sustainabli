import React, { useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import {
	Drawer,
  DrawerNavigation,
  DrawerNavigationHeader,
  DrawerOverflow,
	DrawerToC,
	DrawerToggle,
} from 'react-bootstrap-drawer';
import 'react-bootstrap-drawer/lib/style.css';
import './NavDrawer.scss';

export const NavDrawer = (props) => {
	const [open, setOpen] = useState(true);

	const handleToggle = () => setOpen(!open);

	return (
		<Drawer { ...props }>
			<DrawerToggle onClick={ handleToggle } />
        <Collapse in={ open }>
				<DrawerOverflow>
					<DrawerToC>
						<DrawerNavigationHeader href="/"><h3>Sustainabli</h3></DrawerNavigationHeader>
            <br/>
            <Nav.Item>
              <Nav.Link href="/"><h6>Home</h6></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/impact"><h6>Impact</h6></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/goals"><h6>Goals</h6></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/team"><h6>Our Team</h6></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/notices"><h6>Notices</h6></Nav.Link>
            </Nav.Item>
					</DrawerToC>
				</DrawerOverflow>
			</Collapse>
		</Drawer>
	);
};

