import React from 'react';

const Message = (props) => (
    <div className={"media media-chat "+ (props.user == props.loggedInUser ? "media-chat-reverse" : "")}>
        <div className="avatar" id="profileImage" style={props.userColors}>{props.user.charAt(0)}</div>
        <div className="media-body">
            <p>{props.message}</p>
            {/* <p className="meta"><time dateTime="2018">23: 58</time></p> */}
        </div>
    </div>
);

export default Message;