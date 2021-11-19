import React from 'react';

const Message = (props) => (
    <div className={"media media-chat "+ (props.user == props.loggedInUser ? "media-chat-reverse" : "")}>
        <img className="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." />
        <div className="media-body">
            <p>{props.message}</p>
            {/* <p className="meta"><time dateTime="2018">23: 58</time></p> */}
        </div>
    </div>
);

export default Message;