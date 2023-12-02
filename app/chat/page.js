"use client";
import { useEffect, useState } from "react";
import React from "react";
import "./page.css";
import {
  captionPromt,
  checkServer,
  validateUser,
} from "../services/caption.service";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LuLayoutDashboard,
  LuLayers,
  LuSettings2,
} from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatPopup from "@/components/ChatPopup";
import ChatMessage from "@/components/ChatMessage";
import ChatMessageReverse from "@/components/ChatMessageReverse";
import ChatLoading from "@/components/ChatLoading";

const page = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  // const [promtCaption, setPromtCaption] = useState(null);;
  const [messages, setMessages] = useState([])
  useEffect(() => {
    setLoading(true);
    validateUser()
      .then((res) => {
        if (!_.isEmpty(res)) {
          checkServer()
            .then(() => {
              toast.success("Server Connected 😄!");
              setLoading(false);
            })
            .catch((error) => {
              toast.error("It seems like there's an issue with the server 😕");
              setLoading(false);
            });
        } else {
          toast.error("Something wrong!");
          setLoading(false);
          router.push("/login");
          localStorage.clear();
        }
      })
      .catch((error) => {
        toast.error("Something wrong!");
        setLoading(false);
        router.push("/login");
        localStorage.clear();
      });
  }, []);
  const sendMessage = () => {
    setMessages(current => [...current, {messages: text, type: 'send'}])
    setLoading(true)
    captionPromt(text)
      .then((res) => {
        setLoading(false);
        setMessages(current => [...current, {messages: res.data, type: 'receive'}]);
        setText('')
      })
      .catch((error) => {
        toast.error(error.message || "Something wents wrong!");
        setLoading(false);
    });
  };

  const handleChange = (event) => {
    setText(event.target.value)
  }

  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
  };


  return (
    <main className="body-main">
      <ToastContainer />
      <ChatPopup isOpen={isChatOpen} onClose={handleClick} />
      <header className="header" id="header">
        <div className="header_toggle">
          {/* <span style={{ color: "white" }} id="header-toggle"><i data-feather="menu"></i></span> */}
        </div>
        <div className="header_img">
          <img src="https://i.imgur.com/hczKIze.jpg" alt="" />
        </div>
      </header>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <a href="#" className="nav_logo">
              <span style={{ color: "white" }}>
                <LuLayers style={{ fontSize: "20px" }} />
              </span>
              <span className="nav_logo-name">Chat</span>
            </a>
            <div className="nav_list">
              <Link href="/" className="nav_link active">
                <span style={{ color: "white" }}>
                  <LuLayoutDashboard style={{ fontSize: "20px" }} />
                </span>
              </Link>
              <Link href="/setting" className="nav_link">
                <span style={{ color: "white" }}>
                  <LuSettings2 style={{ fontSize: "20px" }} />
                </span>
              </Link>
              <Link
                href="/login"
                onClick={() => {
                  localStorage.clear();
                }}
                className="nav_link"
              >
                <span style={{ color: "white" }}>
                  <RxExit style={{ fontSize: "20px" }} />
                </span>
              </Link>
            </div>
          </div>
          {/* <a className="nav_link" onClick={() => {
            logout();
            router.push("/login");
          }}>
            <span style={{ color: "white" }}><LuLogOut style={{ fontSize: "20px" }} /></span>
            <span className="nav_name">SignOut</span>
          </a> */}
        </nav>
      </div>
      <div className="height-100 main-section">
        <div className="main-card">
          <div className="header-section">
            <div className="row">
              <div className="col-8">
                <img
                  style={{ maxWidth: "10%", marginTop: "10px" }}
                  src="https://i.ibb.co/6DWKXZL/logo-light.png"
                />
              </div>
              {/* <div className="col-4">
                <button
                  className={`main-btn ${loading ? "disabled-button" : ""}`}
                  disabled={loading}
                  onClick={uploadImage}
                >
                  Upload
                </button>
                <input
                  id="uploadFile"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  name="image"
                  className="img"
                />
              </div> */}
            </div>
          </div>

          <div
            className="center"
            style={{
              margin: mode == "ppt" ? "0" : "",
              padding:
                mode == "ppt" &&
                captions &&
                mode == "ppt" &&
                (!loading || (loading && captions))
                  ? "0px 40px"
                  : "40px",
            }}
          >
            
            <div class="--dark-theme" id="chat">
              <div className="chat__conversation-board">
                {messages.map((x, index) => (
                  <React.Fragment key={index}>
                    {x.type === "send" ? (
                      <ChatMessageReverse text={x.messages} />
                    ) : (
                      <ChatMessage text={x.messages} />
                    )}
                  </React.Fragment>
                ))}
                {loading ? <ChatLoading/>: <></>}
              </div>
              <div class="chat__conversation-panel">
                <div class="chat__conversation-panel__container">
                  <button class="chat__conversation-panel__button panel-item btn-icon add-file-button">
                    <svg
                      class="feather feather-plus sc-dnqmqq jxshSx"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button class="chat__conversation-panel__button panel-item btn-icon emoji-button">
                    <svg
                      class="feather feather-smile sc-dnqmqq jxshSx"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </button>
                  <input
                    class="chat__conversation-panel__input panel-item"
                    placeholder="Type a message..."
                    name="message"
                    onChange={handleChange}
                    value={text}
                  />
                  <button class="chat__conversation-panel__button panel-item btn-icon send-message-button" onClick={sendMessage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      data-reactid="1036"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
