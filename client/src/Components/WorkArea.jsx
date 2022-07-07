import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import Editor from './Editor';
import User from './User';
import DoUsername from 'do_username';
import ActiveUsersModal from './ActiveUsersModal';

const WorkArea = () => {
	const [orientation, setOrientation] = useState('horizontal');
	const [name, setName] = useState(DoUsername.generate(15));
	const [show, setShow] = useState(true);
	const [activeUsersmodalShow, setActiveUsersModalShow] = useState(false);
	const [activeUsers, setActiveUsers] = useState([]);

	useEffect(() => {
		let changeOrientation = () => {
			setOrientation(window.innerWidth < 600 ? 'vertical' : 'horizontal');
		};
		changeOrientation();
		window.onresize = changeOrientation;
	}, []);

	const setUsername = (Uname) => {
		setName(Uname);
	};

	const setModalShow = (show) => {
		setShow(show);
	};

	const setUsers = (users) => {
		setActiveUsers(users);
	};
	const text = `${name} invited you to collaborate in real-time on his Editor. Click the link below to join. `;
	return (
		<div className="">
			{show && <User setName={setUsername} setShow={setModalShow} />}
			{!show && (
				<>
					<ActiveUsersModal
						show={activeUsersmodalShow}
						onHide={() => setActiveUsersModalShow(false)}
						activeUsers={activeUsers}
					/>
					<div className="active-users-btn-container">
						<button
							className="btn btn-primary text-end"
							onClick={() => setActiveUsersModalShow(true)}
						>
							Active Users
						</button>
						<button
							className="btn btn-primary text-end"
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(
										text + window.location.href
									);
									alert('Copied to clipboard successfully!');
								} catch (err) {
									alert('Copy failed: ' + err);
								}
							}}
						>
							Copy Invite Link
						</button>
					</div>
					<div className="work-area work">
						<Split
							className="wrapper-card"
							sizes={[50, 50]}
							minSize={orientation === 'horizontal' ? 300 : 100}
							expandToMin={true}
							gutterAlign="center"
							direction={orientation}
						>
							<Editor
								name={name}
								id="edit"
								className="markdown-edit"
								setUsers={setUsers}
							/>
							<div className=" container work_area ">
								<h2>
									<b style={{ color: 'white' }}>Here is the Preview</b>
								</h2>
								<div id="targetDiv"></div>
							</div>
						</Split>
					</div>
				</>
			)}
		</div>
	);
};

export default WorkArea;
