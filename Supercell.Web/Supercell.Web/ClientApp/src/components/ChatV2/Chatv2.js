import React, { useState, useEffect, useRef } from 'react';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

import { v4 as uuidv4 } from 'uuid';

const Chat = ({ connection, loggedUser }) => {
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);
    latestChat.current = chat;

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
        connection.on('ReceiveMessage', (user, color, message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push({ user, color, message });

            setChat(updatedChat);
            console.log('ReceiveMessage');
        });

        connection.on('ReceiveCorrection', (betterMessage, originalMessage) => {
            const updatedMsgs = [...latestBadMessages.current];
            updatedMsgs.push({ betterMessage, originalMessage, id: uuidv4() });

            setBadMessages(updatedMsgs);
            console.log('ReceiveCorrection');
        });
    }, [connection]);

    const isConfirm = async (dm, decision) => {
        if (decision) {
            await forceSendMessage(dm.betterMessage);
        } else {
            // -- Karma
            await forceSendMessage(dm.originalMessage);            
        }

        const updatedMsgs = [...latestBadMessages.current];

        setBadMessages(updatedMsgs.filter(i => i.id !== dm.id));
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