import React from 'react';
import Image from 'react-bootstrap/Image';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Sidebar, Menu, MenuItem, useProSidebar, sidebarClasses } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import {
  // Webpage paths
  DATA_QUERY_PAGE_PATH,
  FUME_HOODS_PAGE_PATH,
  ORGANIZATION_PAGE_PATH,
  OVERVIEW_PAGE_PATH,
  PROFILE_PAGE_PATH,
  SHUT_THE_SASH_PAGE_PATH,

  // Account roles
  ORGANIZATION_ADMIN_ROLE
} from '../../Constants.js';
import logo from '../../../assets/logo.png';
import './NavSidebar.scss';

function NavSidebar({userInfo}) {
  const { broken, toggleSidebar } = useProSidebar();
  const pathname = useLocation().pathname;

  // react-pro-sidebar recommends in-line styling
  const sidebarContainerStyle = {
    color: 'white',
    paddingTop: '15px',
  }
  const menuItemStyle = {
    // Need to be able to style menu items/buttons based on if they are active or disabled
    // Use the pathname to determine if the menu item is active (e.g. /team)
    button: ({ active }) => {
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

  const renderMenuItem = (path, content, isLastMenuItem) => {
    return (
      <MenuItem
        className={isLastMenuItem ? 'lastMenuItem' : 'sidebarHeader'}
        active={pathname === path}
        component={<Link to={path} />}
      >
        {content}
      </MenuItem>
    );
  }

  // TODO add functionality to only show specific nav items for specific user roles (e.g. organzation admin has access to pages that other accounts don't)
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
          {renderMenuItem(OVERVIEW_PAGE_PATH, <Image src={logo} width='130'/>, false)}
          {userInfo && renderMenuItem(OVERVIEW_PAGE_PATH, 'Overview', false)}
          {userInfo && userInfo.role === ORGANIZATION_ADMIN_ROLE && renderMenuItem(ORGANIZATION_PAGE_PATH, 'Organization', false)}
          {userInfo && renderMenuItem(FUME_HOODS_PAGE_PATH, 'Fume Hoods', false)}
          {userInfo && renderMenuItem(DATA_QUERY_PAGE_PATH, 'Data Query', false)}
          {/* TODO make shut the sash page */}
          {userInfo && renderMenuItem(SHUT_THE_SASH_PAGE_PATH, 'Shut the Sash', false)}
          {renderMenuItem(PROFILE_PAGE_PATH, 'Profile', true)}
        </Menu>
      </Sidebar>
    </React.Fragment>
  );
}

export default NavSidebar;
