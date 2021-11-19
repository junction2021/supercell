import React from 'react';

import Message from './Message';

const ChatWindow = (props) => {
    const chat = props.chat
        .map(m => <Message 
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.message}/>);

    return(
        <div className="ps-container ps-theme-default ps-active-y" style={{overflowY: 'scroll !important', height: '400px !important'}}>
            {chat}
        </div>
    )
};

export default ChatWindow;