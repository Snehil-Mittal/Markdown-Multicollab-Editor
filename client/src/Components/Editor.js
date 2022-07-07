import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';
import axios from 'axios';
import 'quill/dist/quill.snow.css';
import './Editor.css';
import { useParams } from 'react-router-dom';
import randomColor from 'randomcolor';

Quill.register('modules/cursors', QuillCursors);

const Editor = (props) => {
	let { id } = useParams();
	const history = useHistory();
	const [isPresent, setIsPresent] = useState();
	const provider = useRef();
	const awareness = useRef();
	const quill = useRef();
	const data = useRef();
	const connect = (room) => {
		try {
			const ydoc = new Y.Doc();
			provider.current = new WebrtcProvider(room, ydoc);
			const yText = ydoc.getText('quill');
			quill.current = new Quill('#editor', {
				modules: {
					cursors: true,
					toolbar: [],
					history: {
						userOnly: true,
					},
				},
				placeholder: 'Start collaborating...',
				theme: 'snow',
			});

			awareness.current = provider.current.awareness;
			const setUsername = () => {
				awareness.current.setLocalStateField('user', {
					name: props.name,
					color: randomColor(),
				});
			};
			setUsername();
			const binding = new QuillBinding(yText, quill.current, awareness.current);
			yText.observe((a, b) => {
				var showdown = require('showdown');
				var converter = new showdown.Converter();
				var text = quill.current.getText();
				var html = converter.makeHtml(text);
				var target = document.getElementById('targetDiv');
				target.innerHTML = html;
			});
			props.setUsers([{ name: props.name }]);
			awareness.current.on('change', () => {
				const newUsers = [];
				awareness.current.getStates().forEach((state) => {
					if (state.user) {
						newUsers.push(state.user);
					}
				});
				props.setUsers(newUsers);
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (isPresent === false) history.push('/PageNotFound');
		else if (isPresent === true) connect(id);
	}, [isPresent, history]);

	useEffect(() => {
		const checkServer = async (id) => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_URL}/${id}`);
				console.log(res);
				if (res.data.isPresent) data.current = res.data?.room?.values;
				setIsPresent(res.data.isPresent);
			} catch (err) {
				setIsPresent(false);
				console.log(err);
			}
		};
		const isPresent = checkServer(id);
		if (isPresent === false) {
			history.push('PageNotFound');
		}

		return () => {
			provider.current?.destroy();
			console.log(provider.current);
		};
	}, []);

	const saveData = async () => {
		const text = quill.current.getText();
		const res = await axios.post(`${process.env.REACT_APP_URL}/${id}`, {
			text,
		});
		return;
	};

	return (
		<div className="edit">
			<div id="editor"></div>
			<button onClick={saveData} className="btn btn-outline-success">
				Save
			</button>
		</div>
	);
};

export default Editor;
