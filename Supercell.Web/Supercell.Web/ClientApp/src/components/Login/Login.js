import React, { useState } from 'react';
import './Login.css';

const Login = ({ setUser }) => {
    const [userName, setUserName] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        setUser(userName);
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