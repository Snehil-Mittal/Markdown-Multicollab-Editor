import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const User = (props) => {
	const [uname, setUname] = useState();
	const [show, setShow] = useState(true);
	const handleClose = (name) => {
		setShow(false);
		props.setShow(false);
	};
	const handleChange = (e) => {
		setUname(e.target.value);
		props.setName(e.target.value);
	};

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Enter Name</Modal.Title>
				</Modal.Header>
				<Form.Control
					className="userInp"
					id="usernameid"
					type="text"
					placeholder="username"
					autoFocus
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<Button
					className="btn btn-outline-primary"
					id="userNamebtn"
					value={uname}
					onClick={(e) => handleClose(e.target.value)}
				>
					Join Room
				</Button>
			</Modal>
		</>
	);
};

export default User;
