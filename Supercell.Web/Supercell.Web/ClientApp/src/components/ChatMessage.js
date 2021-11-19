import React, { Component } from 'react';

export class ChatMessage extends Component {
    render(){
        return <p style={{ marginBottom: 0 }}>{this.props.message}<br /><small>{this.props.timestamp}</small></p>
    }
}