import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './LoginHeader.scss';

const LoginHeader = () => {
	return (
		<Container fluid className='p-0 m-0 LoginHeader'>
			<Row className='text-center header'>
				<h1> Welcome to Sashimi </h1>
				<h3> Manage your organization's fume hoods all in one place </h3>
			</Row>
			<Row className='justify-content-md-center blurb'>
				Please login or create an account to access Sashimi services
			</Row>
		</Container>
	);
}

export default LoginHeader;