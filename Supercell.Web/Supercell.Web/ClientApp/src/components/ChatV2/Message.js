import React from 'react';

const Message = (props) => (
    <div className="media media-chat">
        <div className="media-body"> <strong>{props.user}: </strong>
            <p>{props.message}</p>
            <p className="meta"><time dateTime="2018">23: 58</time></p>
        </div>
    </div>
);

export default Message;