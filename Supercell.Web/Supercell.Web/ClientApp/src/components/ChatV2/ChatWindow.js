import React, { useRef, useEffect } from 'react';

import Message from './Message';

const ChatWindow = (props) => {
    const chat = props.chat
        .map(m => <Message
            key={Date.now() * Math.random()}
            loggedInUser={props.loggedInUser}
            userColors={m.color}
            user={m.user}
            message={m.message} />);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        scrollToBottom();
    }, [props.chat]);

    return (
        <div className="ps-container ps-theme-default ps-active-y chat-frame">
            {chat}
            <div ref={messagesEndRef} />
        </div>
    )
};

export default ChatWindow;