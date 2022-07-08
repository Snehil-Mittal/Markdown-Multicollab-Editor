import React, { useState, useEffect, useRef } from "react";
import Split from "react-split";
import Editor from "./Editor";
import User from "./User";
import DoUsername from "do_username";
import ActiveUsersModal from "./ActiveUsersModal";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const WorkArea = () => {
  const [orientation, setOrientation] = useState("horizontal");
  const [name, setName] = useState(DoUsername.generate(15));
  const [show, setShow] = useState(true);
  const [activeUsersmodalShow, setActiveUsersModalShow] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isPresent, setIsPresent] = useState();
  const data = useRef();
  let { id } = useParams();
  const history = useHistory();

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
    checkServer(id);

    let changeOrientation = () => {
      setOrientation(window.innerWidth < 600 ? "vertical" : "horizontal");
    };
    changeOrientation();
    window.onresize = changeOrientation;
  }, [id, history]);

  useEffect(() => {
    if (isPresent === false) history.push("/PageNotFound");
  }, [isPresent, history]);

  const setUsername = (Uname) => {
    setName(Uname);
  };

  const setModalShow = (show) => {
    setShow(show);
  };

  const setUsers = (users) => {
    setActiveUsers(users);
  };

  return (
    <div className="">
      {isPresent && show && (
        <User setName={setUsername} setShow={setModalShow} />
      )}
      {isPresent && !show && (
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
          </div>
          <div className="work-area work">
            <Split
              className="wrapper-card"
              sizes={[50, 50]}
              minSize={orientation === "horizontal" ? 300 : 100}
              expandToMin={true}
              gutterAlign="center"
              direction={orientation}
            >
              <Editor
                name={name}
                id="edit"
                className="markdown-edit"
                setUsers={setUsers}
                isPresent={isPresent}
              />
              <div className=" container work_area ">
                <h2>
                  <b style={{ color: "white" }}>Here is the Preview</b>
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
