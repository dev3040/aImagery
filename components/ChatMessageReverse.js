import React from "react";

const ChatMessageReverse = (props) => {
  return (
    <div className="chat__conversation-board__message-container reversed">
      <div className="chat__conversation-board__message__person">
        <div className="chat__conversation-board__message__person__avatar">
          <img
            src="https://randomuser.me/api/portraits/men/9.jpg"
            alt="Dennis Mikle"
          />
        </div>
        <span className="chat__conversation-board__message__person__nickname">
          Dennis Mikle
        </span>
      </div>
      <div className="chat__conversation-board__message__context">
        <div className="chat__conversation-board__message__bubble">
          {" "}
          <span>{props.text}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageReverse;
