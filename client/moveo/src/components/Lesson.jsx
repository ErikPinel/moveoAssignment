import React, { useEffect, useReducer, useRef, useState } from "react";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import io from "socket.io-client";
import "./lesson.css";

import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import axios from "axios";

let isSocketIni = false;
var initialCodeValueDb=''
const Lesson = ({ title, codeDescription, codeSolution, setCurentLesson }) => {
  const [socket, setSocket] = useState(io.connect("https://starter-express-api-5puy.onrender.com/"));
  const [showSolution, setShowSolution] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const [isSmileyShown, setIsSmileyShown] = useState(false);
  const [isEditEnabled, setIsEditEnabled] = useState(false);

  const editorRef = useRef(null);
  const isSmileyShownRef = useRef(isSmileyShown);
  const isEditEnabledRef = useRef(isEditEnabled);
  const room = title;
  async function init() {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        readOnly: !isEditEnabledRef.current,
        
      }
    );
    if(initialCodeValueDb)
    {
      editorRef.current.setValue(initialCodeValueDb)
      initialCodeValueDb=''
    }
    
    editorRef.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const data = instance.getValue();
      if (data.trim() == codeSolution.trim() && !isSmileyShownRef.current) {
        setShowSmiley(true);
        setIsSmileyShown(!isSmileyShown);
        isSmileyShownRef.current = true;
      }

      if (origin !== "setValue") {
        socket.emit("send_message", {
          room,
          data,
        });
      }
    });
  }


  function getCurrentCodeDb(lessonName) {
    axios
      .get(`https://starter-express-api-5puy.onrender.com/api/v1/lastSavedCode/${lessonName}/`)
      .then((response) => {
        editorRef.current.setValue(response.data);
      });
  }


  function saveCodeToDb() {
    const lessonName=title;
    const code =editorRef?.current?.getValue();
    axios
      .patch(`https://starter-express-api-5puy.onrender.com/api/v1/saveCode/`,{lessonName,code})
      .then((response) => {
        console.log(response)
      });
  }


  socket.on("connect", () => {
    socket.emit("join_room", room, socket.id);
  });

  socket.on("joined", ({ socketId }) => {
    socket.emit("sync_code", {
      data: editorRef?.current?.getValue(),
      socketId,
    });
  });
  useEffect(()=>{
    init();
  },[])

  useEffect(() => {
    socket.on("room_size", (data, id) => {
      if( (!editorRef?.current?.getValue())&&data==1){
       try{ initialCodeValueDb=getCurrentCodeDb(title)
       }catch(err){console.log("err")}
      }
      if (!isEditEnabled) {
        if (data > 1) {
          setIsEditEnabled(true);
          isEditEnabledRef.current = true;
        }

      }
      if (id == socket.id) init();
    });

    if (socket) {
      socket.on("receive_message", (data) => {
        if (data !== null) {
          editorRef.current.setValue(data);
          if (data == codeSolution) {
          }
        }
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [socket]);


  return (
    <div className="LessonContainer">
      {showSmiley && (
        <div id="smileyWrapper">
          <div
            id="backToLessonIconWrapper"
            onClick={() => setShowSmiley(false)}
          >
            <ArrowBackIcon className="icon" fontSize="large" />
          </div>
          <img id="smileyImg" src="https://www.pikpng.com/pngl/m/19-191298_smiley-face-emoji-text-smiley-clipart.png" />
        </div>
      )}

      <div className="codeSection">
        <div id='saveToDbIcon' onClick={()=>saveCodeToDb()} >save to DB</div>
        <textarea id="realtimeEditor" />
      </div>

      <div className="descriptionSection">
        <div id="header">
          <div
            onClick={() => {
              setCurentLesson("");
            }}
          >
            <ArrowBackIcon className="icon" />
          </div>
          <h2>{title}</h2>
          <h4>{codeDescription}</h4>
        </div>

        <div id="solution">
          {showSolution ? (
            <div>
              <div
                className="iconSolution"
                onClick={() => setShowSolution(!showSolution)}
              >
                <VisibilityOffIcon  className="icon"/>
              </div>
              <pre>{codeSolution}</pre>
            </div>
          ) : (
            <div
              className="iconSolution"
              onClick={() => setShowSolution(!showSolution)}
            >
              <LightbulbIcon className="icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
