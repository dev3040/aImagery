import React from 'react';
import '../styles/ChatPopup.css';

const ChatPopup = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="chat-popup">
            <div className="chat-header">
                <h6>Chat</h6>
                <span onClick={onClose} className="close-button">
                    &times;
                </span>
            </div>
            <div className="chat-body">
                <div className="chat-message">

                    <div className="message-content-third">
                        <p>This is a sample message in the chat popup.</p>
                    </div>
                    <div className="message-content-sender">
                        <p>This is a sample message in the chat popup.</p>
                    </div>
                </div>

                {/* Add more chat messages as needed */}
            </div>
            {/* <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div> */}
        </div>
    );
};

export default ChatPopup;
