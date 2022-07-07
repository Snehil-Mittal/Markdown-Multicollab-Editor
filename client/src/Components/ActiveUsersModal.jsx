import { Modal, Button, ListGroup } from 'react-bootstrap';
import './ActiveUsersModal.css';

const ActiveUsersModal = (props) => {
	const usersjsx = (
		<ListGroup variant="flush" as="ol" numbered>
			{props.activeUsers.map((user) => (
				<ListGroup.Item as="li" key={user.name}>
					{user.name}
				</ListGroup.Item>
			))}
		</ListGroup>
	);
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			className="activeUsersModal"
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					List of Active Users
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="overflow-auto active-users-modal-body">
				{usersjsx}
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ActiveUsersModal;
