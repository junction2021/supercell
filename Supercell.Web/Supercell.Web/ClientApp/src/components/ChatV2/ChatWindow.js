import React, { useRef, useEffect } from 'react';

import ConfirmBadMessage from './ConfirmBadMessage';

import Message from './Message';

const ChatWindow = (props) => {
    const chat = props.chat
        .map(m => <Message
            key={Date.now() * Math.random()}
            loggedInUser={props.loggedInUser}
            userColors={m.color}
            user={m.user}
            message={m.message} />);

    // const badMessages = props.badMessages
    //     .map(dm => <ConfirmBadMessage 
    //         key={Date.now() * Math.random()}
    //         betterMessage={dm.betterMessage}
    //         originalMessage={dm.originalMessage}
    //         isConfirm={decision => props.isConfirm(dm, decision)} />);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        scrollToBottom();
    }, [props.chat, props.badMessage]);

    return (
        <div className="ps-container ps-theme-default ps-active-y chat-frame">
            {chat}
            {props.badMessage
                ? <ConfirmBadMessage
                    key={Date.now() * Math.random()}
                    betterMessage={props.badMessage.betterMessage}
                    originalMessage={props.badMessage.originalMessage}
                    isConfirm={decision => props.isConfirm(props.badMessage, decision)} />
                : <></>
            }
            {/* {badMessages} */}
            <div ref={messagesEndRef} />
        </div>
    )
};

export default ChatWindow;