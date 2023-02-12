import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Select from 'react-select'
import { withAuth0 } from '@auth0/auth0-react';
import Header from '../Header/Header';
import { ALL_LAB_FUMEHOOD_NAMES } from '../../utils/Constants.js';
import { getUserInfo, updateUserInfo } from '../../utils/Utils.js';

class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
      isNewUser: true,
      fetchedUserInfo: false,
      selectedFumehoods: [],
    }
  }

  // Load up the user selected fumehoods from the database.
  // If the user email isn't found in the database, this will default to empty array.
  // Also sets isNewUser, which will determine if we should use a POST (new user) or PUT (existing user) request when updating the profile.
  componentDidUpdate = async () => {
    const { isAuthenticated, user } = this.props.auth0;
    const { fetchedUserInfo } = this.state;
    let userSelectedFumehoods = [];
    let isNewUser = true;

    // Using fetchedUserIinfo to prevent redundent fetches to database for user info
    if (!fetchedUserInfo && isAuthenticated && user && user.email) {
      const userInfo = await getUserInfo({email: user.email});
      if (userInfo) {
        userSelectedFumehoods = userInfo ? userInfo[0].fumehoods : [];
        isNewUser = false;
      }
      this.setState({
        isNewUser: isNewUser,
        fetchedUserInfo: true,
        selectedFumehoods: userSelectedFumehoods
      });

    }
  }

  // Send updated user profile info to database.
  // If it's a new user, use post request. Otherwise use put request.
  updateUserProfile = () => {
    const { user } = this.props.auth0;
    const { isNewUser, selectedFumehoods } = this.state;
    const reqBody = {
      name: user.name,
      email: user.email,
      fumehoods: selectedFumehoods,
    };
    updateUserInfo(reqBody, isNewUser);
  }

  onChangeSelectedFumehoods = options => {
    this.setState({
      selectedFumehoods: options.map(option => option.value)
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth0;
    const { selectedFumehoods } = this.state;
    const options = ALL_LAB_FUMEHOOD_NAMES.map(fumehood => ({value: fumehood, label: fumehood}));
    return (
      <Container fluid className='ProfilePage'>
        <Header pageName='Profile' />
        {isAuthenticated && (
          <React.Fragment>
            <h2>{user.name}</h2>
            <span>{user.email}</span>
            <Select
              options={options}
              isMulti={true}
              onChange={options => this.onChangeSelectedFumehoods(options)}
              value={selectedFumehoods.map(fumehood => ({value: fumehood, label: fumehood}))}
              closeMenuOnSelect={false}
            />
            <Button
              className='query-metrics-button'
              onClick={() => this.updateUserProfile()}
            >
              Update Selected Fumehoods
            </Button>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default withAuth0(ProfilePage);
