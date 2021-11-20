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

    const badMessages = props.badMessages
        .map(dm => <ConfirmBadMessage 
            key={Date.now() * Math.random()}
            betterMessage={dm.betterMessage}
            originalMessage={dm.originalMessage}
            dismiss={() => correctionDismissed(dm.originalMessage)}
            confirm={() => correctionConfirmed(dm.betterMessage)} />);

    const correctionDismissed = (message) => {
        props.forceSendMessage(message);

        props.updateBadMessages(props.badMessages.filter(i => i.originalMessage !== message));
    };

    const correctionConfirmed = (message) => {
        props.sendMessage(message);

        props.updateBadMessages(props.badMessages.filter(i => i.betterMessage !== message));
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        scrollToBottom();
    }, [props.chat, props.badMessages]);

    return (
        <div className="ps-container ps-theme-default ps-active-y chat-frame">
            {chat}
            {badMessages}
            <div ref={messagesEndRef} />
        </div>
    )
};

export default ChatWindow;