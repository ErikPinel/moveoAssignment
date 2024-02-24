import React, { useEffect, useRef, useState } from "react";
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

const Lesson = ({
  
  title,
  codeDescription,
  codeSolution,
  setCurentLesson,
}) => {
  const [socket, setSocket] = useState(io.connect("http://localhost:3001"));
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [messageReceived, setMessageReceived] = useState("");
  const [isEditEnabled,setIsEditEnabled]=useState(false)

  const editorRef = useRef(null);
  const room = title;





  useEffect(() => {
    socket.emit("join_room", room);
   
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const data = instance.getValue();
        if (origin !== "setValue") {
          socket.emit("send_message", {
            room,
            data,
          });
        }
      });
    }
    init();
    
  }, []);


  useEffect(() => {
    console.log("recived main1");
    socket.on("receive_message", (data) => {
      console.log("recived main");
      setMessageReceived(data.message);
    });


    socket.on("room_size", (data)=>{
      console.log(data+"data size")
      if(!isEditEnabled)
      {
        if(data>1)
        setIsEditEnabled(true)
        
      }
      
    })
    

  }, [socket]);


  useEffect(() => {
    console.log("recived");
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
        console.log('disconnect toom')
    };
  }, [socket]);

  const sendMessage = (e) => {
    const data = e.target.value;
    socket.emit("send_message", { data, room });
  };

  return (
    <div className="LessonContainer">
      <div className="codeSection">
        <textarea id="realtimeEditor" />
      </div>

      <div className="descriptionSection">
        <div id="header">
          <div onClick={() => {setCurentLesson("");}}>
            <ArrowBackIcon />
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
                {" "}
                <VisibilityOffIcon />
              </div>
              <pre>{codeSolution}</pre>
            </div>
          ) : (
            <div
              className="iconSolution"
              onClick={() => setShowSolution(!showSolution)}
            >
              {" "}
              <LightbulbIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
