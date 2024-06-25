// Top level entry to the app. We use AWS Amplify to manage user login authentication. The amplifyUser info is passed to the next level in the app

import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import LoginHeader from './components/LoginHeader/LoginHeader';
import RoutesContainer from './components/RoutesContainer/RoutesContainer';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {

  const signUpFields = {
		signUp: {
      email: {
        order: 1
      },
      password: {
        order: 2
      },
      confirm_password: {
        order: 3
      },
      name: {
				placeholder: 'Enter your Name',
				isRequired: true,
				label: 'Name',
				order: 3
			},
		}
  }

  // Components used for amplify login
  const components = {
    Header() {
      return <LoginHeader />
    }
  }

  return (
    <Authenticator 
      loginMechanisms={['email']} 
      components={components}
      formFields={signUpFields}
    >
      {({ user }) => <RoutesContainer amplifyUser={user.signInDetails} />}
    </Authenticator>
  );
}

export default App;
