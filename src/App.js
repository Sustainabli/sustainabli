import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import LoginHeader from './components/LoginPage/LoginHeader';
import RoutesContainer from './components/RoutesContainer/RoutesContainer';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {
  // Components used for amplify login
  // TODO add field for user's name so we can store in database
  const components = {
    Header() {
      return <LoginHeader />
    }
  }

  return (
    <Authenticator loginMechanisms={['email']} components={components}>
      {({ user }) => <RoutesContainer amplifyEmail={user.signInDetails.loginId} />}
    </Authenticator>
  );
}

export default App;