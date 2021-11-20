import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatInput = (props) => {
    const [message, setMessage] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        const isMessageProvided = message && message !== '';

        if (isMessageProvided) {
            props.sendMessage(message);
            setMessage('');
        }
        else {
            alert('Please insert a message.');
        }
    }

    const onMessageUpdate = (e) => {
        setMessage(e.target.value);
    }

    return (
        <form 
            className="publisher bt-1 border-light"
            onSubmit={onSubmit}>
            <input
                className="publisher-input"
                type="text"
                id="xyz123"
                name="xyz123"
                autoComplete="off"
                placeholder="Say hello!"
                maxLength="250"
                value={message}
                onChange={onMessageUpdate} />
            <button className="publisher-btn text-info"><FontAwesomeIcon icon={faPaperPlane} /></button>
        </form>
    )
};

export default ChatInput;