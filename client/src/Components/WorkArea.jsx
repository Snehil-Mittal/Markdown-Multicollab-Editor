import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import Editor1 from './Editor';
import User from './User';
import DoUsername from "do_username";

const WorkArea=()=> {
	const [orientation, setOrientation] = useState('horizontal');
	const [name, setName] = useState(DoUsername.generate(15));
	const [show, setShow] = useState(true);

	useEffect(() => {
		let changeOrientation = () => {
			setOrientation(window.innerWidth < 600 ? 'vertical' : 'horizontal');
		};
		changeOrientation();
		window.onresize = changeOrientation;
	}, []);

	const setUsername=(Uname)=>{
		setName(Uname);
	}

	const setModalShow=(show)=>{
		setShow(show);
	}

	return (
		<div className="work-area work">
			{show && <User setName={setUsername} setShow={setModalShow}/>}
			{!show &&
			<Split
				className="wrapper-card"
				sizes={[50, 50]}
				minSize={orientation === 'horizontal' ? 300 : 100}
				expandToMin={true}
				gutterAlign="center"
				direction={orientation}
			>
				<Editor1 name={name} id="edit" className="markdown-edit" />
				<div className=" container work_area ">
					<h2>
						<b style={{color: "white"}}>Here is the Preview</b>
					</h2>
					<div id="targetDiv"></div>
				</div>
			</Split>}
		</div>
	);
}

export default WorkArea;
