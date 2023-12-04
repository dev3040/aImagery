import React, { useEffect, useRef, useState } from 'react';
import '../styles/ChatPopup.css';
import _ from 'lodash';
import { captionPromt } from '@/app/services/caption.service';
const ChatPopup = ({ isOpen, onClose, questions }) => {
    const [inloading, setInloading] = useState(false);
    const [message, setMessage] = useState([]);
    const myDivRef = useRef(null);
    useEffect(() => {
        if (!_.isEmpty(questions)) {
            const newMessages = questions.map(que => ({
                message: que,
                type: "send",
                isQue: true
            }));

            setMessage([...message, ...newMessages]);
        }
    }, [questions]); // Run this effect whenever questions change

    const handleClick = (que) => {
        setInloading(true)
        const d = [{ message: que, type: "recv", isQue: false }]
        d.push({ message: "", type: "loading", isQue: false })
        setMessage([...message, ...d]);
        scrollDonw()
        captionPromt(que).then(res => {
            d.splice(-1)
            d.push({ message: res.data, type: "send", isQue: false })
            setMessage([...message, ...d]);
            setInloading(false)
            scrollDonw();
        }).catch(error => {
            d.splice(-1)
            d.push({ message: error?.message || "Something wents wrong", type: "send", isQue: false })
            setMessage([...message, ...d]);
            setInloading(false)
        })

    };

    if (!isOpen) {
        return null;
    }
    const scrollDonw = () => {
        if (myDivRef.current) {
            const scrollHeight = myDivRef.current.scrollHeight;
            myDivRef.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth',
            });
        }
    }
    return (
        <div className="chat-popup">
            <div className="chat-header">
                <h6>Chat</h6>
                <span onClick={onClose} className="close-button">
                    &times;
                </span>
            </div>
            <div className="chat-body" ref={myDivRef}>
                <div className="chat-message">
                    {_.isEmpty(questions) ? (
                        <div className="message-content-third">
                            <p className="containerx">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </p>
                        </div>
                    ) : (
                        message.map((x, index) => (
                            <React.Fragment key={index}>
                                {x.type === "send" && x.isQue ? (
                                    <div className="message-content-third">
                                        <p className='pClick'
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                if (!inloading) {
                                                    handleClick(x.message)
                                                }
                                            }}
                                        >
                                            {x.message}
                                        </p>
                                    </div>
                                ) : (x.type === "send" ? (
                                    <div className="message-content-third">
                                        <p dangerouslySetInnerHTML={{ __html: x.message }}></p>
                                    </div>
                                ) :
                                    (x.type == "loading" ?
                                        (<div className="containerx">
                                            <span className="dot"></span>
                                            <span className="dot"></span>
                                            <span className="dot"></span>
                                        </div>) :
                                        (<div className="message-content-sender">
                                            <p>{x.message}</p>
                                        </div>))
                                )}
                            </React.Fragment>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;
