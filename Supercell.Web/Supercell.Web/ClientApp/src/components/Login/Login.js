import React, { useState } from 'react';
import './Login.css';

const Login = ({ setUser }) => {
    const [userName, setUserName] = useState();

    const colors = [
        {backgroundColor: '#cedef0', color: '#9d9ad9'},
        {backgroundColor: '#7b3433', color: '#e9bbba'},
        {backgroundColor: '#777764', color: '#ebebde'},
        {backgroundColor: '#5a431b', color: '#d6a34a'},
        {backgroundColor: '#241f1c', color: '#e7dac7'},
        {backgroundColor: '#404040', color: '#a0b6f7'},
        {backgroundColor: '#1d5c96', color: '#7db0de'},
        {backgroundColor: '#abd1ff', color: '#e54b22'},
        {backgroundColor: '#0f4d19', color: '#6fc27c'},
        {backgroundColor: '#efc8b1', color: '#8a6626'},
        {backgroundColor: '#008970', color: '#99eedf'},
    ];

    const handleSubmit = async e => {
        e.preventDefault();

        const rndNr = Math.floor(Math.random() * (colors.length - 1));
        const userColors = colors[rndNr];
        setUser({name: userName, colors: userColors});
    };

    return (
        <div className="login-wrapper">
            <h1>Please enter your username</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" maxLength={32} onChange={e => setUserName(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Let's GO!</button>
                </div>
            </form>
        </div>
    )
};

export default Login;