import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { QuillBinding } from "y-quill";
import axios from "axios";
import "quill/dist/quill.snow.css";
import "./Editor.css";
import { useParams } from "react-router-dom";
import randomColor from "randomcolor";

Quill.register("modules/cursors", QuillCursors);

const Editor = (props) => {
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
      const yText = ydoc.getText("quill");
      const quill = new Quill("#editor", {
        modules: {
          cursors: true,
          toolbar: [],
          history: {
            userOnly: true,
          },
        },
        placeholder: "Start collaborating...",
        theme: "snow",
      });

      awareness = provider.awareness;
      const setUsername = () => {
        awareness.setLocalStateField("user", {
          name: props.name,
          color: randomColor(),
        });
      };
      setUsername();
      const binding = new QuillBinding(yText, quill, awareness);

      yText.observe((a, b) => {
        var showdown = require("showdown");
        var converter = new showdown.Converter();
        var text = quill.getText();
        var html = converter.makeHtml(text);
        var target = document.getElementById("targetDiv");
        console.log(html);
        target.innerHTML = html;
      });
      awareness.on("change", () => {
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
    if (isPresent === false) history.push("/PageNotFound");
    else if (isPresent === true) connect(id);
  }, [isPresent, history]);

  useEffect(() => {
    const checkServer = async (id) => {
      try {
        const res = await axios.get(`https://markdown-multicollab-editor.herokuapp.com/${id}`);
        console.log(res);
        setIsPresent(res.data.isPresent);
      } catch (err) {
        setIsPresent(false);
        console.log(err);
      }
    };
    const isPresent = checkServer(id);
    console.log(isPresent);
    if (isPresent === false) {
      history.push("PageNotFound");
    }

    return () => {
      provider?.destroy();
      console.log(provider);
    };
  }, []);

  return (
    <div className="edit">
      <div id="editor"></div>
    </div>
  );
};

export default Editor;
