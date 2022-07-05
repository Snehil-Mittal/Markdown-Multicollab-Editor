import React from 'react';
import './Errorpage.css';
import pic from './../assets/error.png';
import { useHistory } from 'react-router-dom';

export default function Errorpage() {
	const history = useHistory();
	const handleBack = () => {
		history.push('/');
	};

	return (
		<div>
			<div className="error-grid container">
				<div className="row">
					<div className="col">
						<img src={pic} className="pic" alt="..." />
					</div>
					<div className="col">
						<div className="error-template">
							<h1>
								<b> Oops! </b>
							</h1>
							<h2>404 Not Found</h2>
							<div className="error-details">
								<b>Sorry, an error has occured, Requested page not found!</b>
							</div>
							<div className="error-actions">
								<button
									type="button"
									onClick={handleBack}
									className="ebutton btn btn-outline-primary"
								>
									Take me home
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
