import React, { useState, useEffect, useRef } from 'react';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

import { v4 as uuidv4 } from 'uuid';

const Chat = ({ connection, loggedUser, setKarma }) => {
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);
    latestChat.current = chat;

    const [badMessage, setBadMessage] = useState(null);

    const [badMessages, setBadMessages] = useState([]);
    const latestBadMessages = useRef(null);
    latestBadMessages.current = badMessages;

    useEffect(() => {
        const fetchChat = async () => {
            const response = await fetch('chat/GetHistory');
            const data = await response.json();
            setChat(data);
        };

        fetchChat();
    }, []);

    useEffect(() => {
        connection.on('ReceiveMessage', (user, color, backgroundColor, message) => {
            console.log('ReceiveMessage');
            const updatedChat = [...latestChat.current];
            updatedChat.push({ user, color: {color, backgroundColor}, message });

            setChat(updatedChat);
        });

        connection.on('ReceiveCorrection', (betterMessage, originalMessage, karma) => {
            // const updatedMsgs = [...latestBadMessages.current];
            // updatedMsgs.push({ betterMessage, originalMessage, id: uuidv4() });

            // setBadMessages(updatedMsgs);
            // console.log('ReceiveCorrection');

            setBadMessage(null);
            setBadMessage({ betterMessage, originalMessage, karma, id: uuidv4() });
        });
    }, [connection]);

    const isConfirm = async (dm, decision) => {
        if (decision) {
            await forceSendMessage(dm.betterMessage);
        } else {
            // -- Karma
            setKarma(dm.karma);
            await forceSendMessage(dm.originalMessage);            
        }

        // const updatedMsgs = [...latestBadMessages.current];

        // setBadMessages(updatedMsgs.filter(i => i.id !== dm.id));
        
        setBadMessage(null);
    };

    const sendMessage = async (message) => {
        try {
            await connection.invoke("SendMessage", loggedUser.name, loggedUser.colors.color, loggedUser.colors.backgroundColor, message);
        }
        catch (e) {
            console.log(e);
        }
    }

    const forceSendMessage = async (message) => {
        await connection.invoke("ForceSendMessage", loggedUser.name, loggedUser.colors.color, loggedUser.colors.backgroundColor, message);
    };

    return (
        <div className="card card-bordered">
            <ChatWindow
                chat={chat}
                badMessage={badMessage}
                badMessages={badMessages}
                isConfirm={isConfirm}
                updateBadMessages={setBadMessages}
                loggedInUser={loggedUser.name}
                forceSendMessage={forceSendMessage}
                sendMessage={sendMessage} />
            <ChatInput sendMessage={sendMessage} />
        </div>
    );
};

export default Chat;