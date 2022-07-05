import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { QuillBinding } from 'y-quill';
import axios from 'axios';
import 'quill/dist/quill.snow.css';
import './Editor.css';
import { useParams } from 'react-router-dom';
import randomColor from 'randomcolor';
import io from 'socket.io-client';
import DoUsername from 'do_username';

Quill.register('modules/cursors', QuillCursors);
// const socket = io("http://localhost:3001");

const Editor = () => {
	let { id } = useParams();
	const history = useHistory();
	const [isPresent, setIsPresent] = useState();
	//users for the set of active users
	const [users, setUsers] = useState([]);
	var provider;
	// console.log(id);
	var awareness = null;
	const connect = (room) => {
		try {
			const ydoc = new Y.Doc();
			provider = new WebrtcProvider(room, ydoc);
			const yText = ydoc.getText('quill');
			const quill = new Quill('#editor', {
				modules: {
					cursors: true,
					toolbar: [],
					history: {
						userOnly: true,
					},
				},
				placeholder: 'Start collaborating...',
				theme: 'snow', // 'bubble' is also great
			});

			const inputElement = document.querySelector('#usernameid');
			awareness = provider.awareness;
			const setUsername = () => {
				awareness.setLocalStateField('user', {
					name: inputElement.value,
					color: randomColor(),
				});
			};
			inputElement.value = DoUsername.generate(15);
			setUsername();
			const binding = new QuillBinding(yText, quill, awareness);
			// var editor_content = quill.container.innerHTML
			// console.log(editor_content)
			yText.observe((a, b) => {
				var showdown = require('showdown');
				var converter = new showdown.Converter();
				var text = quill.getText();
				var html = converter.makeHtml(text);
				var target = document.getElementById('targetDiv');
				//var html = marked.parse(text);
				console.log(html);
				target.innerHTML = html;
			});
			awareness.on('change', () => {
				// Map each awareness state to a dom-string
				const newUsers = [];
				awareness.getStates().forEach((state) => {
					if (state.user) {
						newUsers.push(state.user);
					}
				});
				setUsers(newUsers);
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		console.log(isPresent);
		if (isPresent === false) history.push('/PageNotFound');
		else if (isPresent === true) connect(id);
	}, [isPresent, history]);

	useEffect(() => {
		const checkServer = async (id) => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_URL}/${id}`);
				console.log(res);
				setIsPresent(res.data.isPresent);
			} catch (err) {
				setIsPresent(false);
				console.log(err);
			}
		};
		// socket.on("connect", () => {
		//   console.log("connected", socket);
		// });
		// socket.emit("addUserToRoom", { id });
		const isPresent = checkServer(id);
		console.log(isPresent);
		if (isPresent === false) {
			history.push('PageNotFound');
		}

		return () => {
			provider?.destroy();
			console.log(provider);
		};
	}, []);

	return (
		<div>
			<div id="editor"></div>
		</div>
	);
};

export default Editor;
