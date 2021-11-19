import React, { Component } from 'react';
import { ChatMessageHistory } from './ChatMessageHistory';
import * as signalR from '@microsoft/signalr';

export class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [
                { message: 'Hi Josh', user: 'S' },
                { message: 'How are you?', user: 'S2' }
            ],
            inputText: '',
            user: 'Leon',
            hub: new signalR.HubConnectionBuilder().withUrl("/chathub").build()
        };

        // this.connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();

        this.state.hub.on("ReceiveMessage", function (user, message) {
            var nextMessages = this.state.messages.concat([{ message: message, user: user }]);

            this.setState({ messages: nextMessages });
        });

        this.state.hub.start()
            .then(result => {
                console.log('Connected!');

                // this.state.hub.on("ReceiveMessage", function (user, message) {
                //     var nextMessages = this.state.messages.concat([{ message: message, user: user }]);

                //     this.setState({ messages: nextMessages });
                // });
            })
            .catch(e => console.log('Connection failed: ', e));
    }

    onChange = async (e) => {
        this.setState({ inputText: e.target.value });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        await this.state.hub.invoke("SendMessage", this.state.user, this.state.inputText);
        this.setState({ inputText: '' });
    }

    // handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const requestOpts = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ user: this.state.user, message: this.state.inputText })
    //     };

    //     const response = await fetch('chat', requestOpts);
    //     const data = await response.json();

    //     var nextMessages = this.state.messages.concat([{ message: data.message, user: data.user }]);
    //     var nextInputText = '';

    //     this.setState({ messages: nextMessages, inputText: nextInputText, loading: false });
    // };

    render() {
        var windowStyles = {
            maxWidth: '40em',
            margin: '1rem auto'
        };

        var formStyles = {
            display: 'flex',
        };

        var inputStyles = {
            flex: '1 auto'
        };

        var btnStyles = {
            backgroundColor: '#00d8ff',
            border: 'none',
            color: '#336699',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'bold',
            fontSize: '0.8em'
        };

        return (
            <div style={windowStyles}>
                <ChatMessageHistory messages={this.state.messages} />
                <form style={formStyles} onSubmit={this.handleSubmit}>
                    <input style={inputStyles} type="text" onChange={this.onChange} value={this.state.inputText} />
                    <button style={btnStyles}>Send</button>
                </form>
            </div>
        );
    }
}