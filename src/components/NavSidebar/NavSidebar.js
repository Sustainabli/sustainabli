import React from 'react';
import Image from 'react-bootstrap/Image';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Sidebar, Menu, MenuItem, useProSidebar, sidebarClasses } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { HOME_PAGE_PATH, TEAM_PAGE_PATH, PROFILE_PAGE_PATH } from '../../utils/Constants.js';
import logo from '../../assets/logo.png'
import './NavSidebar.scss';

function NavSidebar() {
  const { toggleSidebar, broken } = useProSidebar();
  const pathname = useLocation().pathname;

  // react-pro-sidebar recommends in-line styling
  const sidebarContainerStyle = {
    color: 'white',
    paddingTop: '15px',
  }
  const menuItemStyle = {
    // Need to be able to style menu items/buttons based on if they are active or disabled
    // Use the pathname to determine if the menu item is active (e.g. /team)
    button: ({ level, active, disabled }) => {
      return {
        '&:hover': {
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          color: 'white'
        },
        fontWeight: active ? 'bold' : 'none',
        marginLeft: '10px',
      }
    },
  }

  return (
    <React.Fragment>
      {broken &&
        <GiHamburgerMenu
          className='m-3 menuToggle'
          onClick={() => toggleSidebar()}
          size={25}
        />
      }
      <Sidebar
        className='p-0 h-100 position-fixed'
        backgroundColor='black'
        width='180px'
        breakPoint='lg'
        rootStyles={{
          [`.${sidebarClasses.container}`]: sidebarContainerStyle,
        }}
      >
        <Menu className= 'p-0' menuItemStyles={menuItemStyle}>
          <MenuItem
            className='sidebarHeader'
            active={pathname === HOME_PAGE_PATH}
            component={<Link to={HOME_PAGE_PATH} />}
          >
            <Image src={logo} width='130'/>
          </MenuItem>
          <MenuItem
            active={pathname === TEAM_PAGE_PATH}
            component={<Link to ={TEAM_PAGE_PATH} />}
          >
            Our Team
          </MenuItem>
          <MenuItem
            className='lastMenuItem'
            active={pathname === PROFILE_PAGE_PATH}
            component={<Link to ={PROFILE_PAGE_PATH} />}
          >
            Profile
          </MenuItem>
        </Menu>
      </Sidebar>
    </React.Fragment>
  );
}

export default NavSidebar;
