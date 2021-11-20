import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

const Chat = (props) => {
    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const fetchChat = async () => {
            const response = await fetch('chat/GetHistory');
            const data = await response.json();
            setChat(data);
        };

        fetchChat();
    }, []);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('/chathub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('ReceiveMessage', (user, color, message) => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push({ user, color, message });

                        setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (message) => {
        try {
            await connection.invoke("SendMessage", props.user.name, props.user.colors, message);
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="page-content page-container" id="page-content">
            <div className="row container-fluid d-flex justify-content-center">
                <div className="col-md-12 pt-3">
                    <div className="jumbotron jumbotron-fluid">
                        <h1 className="text-center">Game in progress...</h1>
                    </div>
                </div>
                <div className="col-md-12 fixed-bottom">
                    <div className="card card-bordered">
                        <ChatWindow chat={chat} loggedInUser={props.user.name} />
                        <ChatInput sendMessage={sendMessage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;