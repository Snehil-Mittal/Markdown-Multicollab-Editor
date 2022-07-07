import React, { useState } from 'react';
import './Start.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import logoImg from '../assets/team_work.png';
import tw1 from '../assets/tw1.png';

export default function Start() {
	const [roomId, setRoomId] = useState('');
	const history = useHistory();
	const handleCreate = async () => {
		try {
			console.log(`${process.env.REACT_APP_URL}/createNew`);
			const res = await axios.get(`${process.env.REACT_APP_URL}/createNew`);
			setRoomId(res.data.id);
			history.push(`/rooms/${res.data.id}`);
		} catch (err) {
			console.log(err);
		}
	};
	const handleJoin = async (roomId) => {
		try {
			const res = await axios.get(`${process.env.REACT_APP_URL}/${roomId}`);
			console.log(res);
			if (res.data.isPresent) {
				setRoomId(res.data.room._id);
				history.push(`/rooms/${res.data.room._id}`);
			}
		} catch (err) {
			history.push('/PageNotFound');
		}
	};

	const handleChange = (e) => {
		let roomId = e.target.value;
		setRoomId(roomId);
	};
	return (
		<>
			<div className="start-grid container">
				<div className="row">
					<div className="left-col col">
						<div className="create">
							<h5>Create Room to have your team workspace</h5>
							<button
								type="button"
								className="button1 btn btn-outline-success"
								onClick={handleCreate}
							>
								Create Room
							</button>
						</div>
						<div className="join">
							<h5>Join an existing room</h5>
							<input
								type="text"
								value={roomId}
								onChange={handleChange}
								placeholder="Enter Room code here..."
							/>
							<button
								type="button"
								value={roomId}
								onClick={(e) => handleJoin(e.target.value)}
								className="button2 btn btn-outline-primary"
							>
								Join Room
							</button>
						</div>
					</div>
					<div className="col">
						<div
							id="carouselExampleInterval"
							className="carousel slide"
							data-bs-ride="carousel"
						>
							<div className="carousel-inner">
								<div className="carousel-item active" data-bs-interval="7000">
									<img src={logoImg} className="d-block w-100" alt="..." />
								</div>
								<div className="carousel-item" data-bs-interval="7000">
									<img src={tw1} className="d-block w-100" alt="..." />
								</div>
							</div>
							<button
								className="carousel-control-prev"
								type="button"
								data-bs-target="#carouselExampleInterval"
								data-bs-slide="prev"
							>
								<span
									className="carousel-control-prev-icon"
									aria-hidden="true"
								></span>
								<span className="visually-hidden">Previous</span>
							</button>
							<button
								className="carousel-control-next"
								type="button"
								data-bs-target="#carouselExampleInterval"
								data-bs-slide="next"
							>
								<span
									className="carousel-control-next-icon"
									aria-hidden="true"
								></span>
								<span className="visually-hidden">Next</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
