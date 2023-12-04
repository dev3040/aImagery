import React from "react";

const ChatMessage = (props) => {
  return (
    <div className="chat__conversation-board__message-container">
      <div className="chat__conversation-board__message__person">
        <div className="chat__conversation-board__message__person__avatar">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
        </div>
        <span className="chat__conversation-board__message__person__nickname">
          Monika Figi
        </span>
      </div>
      <div className="chat__conversation-board__message__context">
        <div className="chat__conversation-board__message__bubble">
          {" "}
          <span>
           {props.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
