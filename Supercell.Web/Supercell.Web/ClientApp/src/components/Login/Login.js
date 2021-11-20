import React, { useState } from 'react';
import './Login.scoped.css';
import { v4 as uuidv4 } from 'uuid';

const Login = ({ setUser }) => {
    const [userName, setUserName] = useState();

    const colors = [
        { backgroundColor: '#cedef0', color: '#9d9ad9' },
        { backgroundColor: '#7b3433', color: '#e9bbba' },
        { backgroundColor: '#777764', color: '#ebebde' },
        { backgroundColor: '#5a431b', color: '#d6a34a' },
        { backgroundColor: '#241f1c', color: '#e7dac7' },
        { backgroundColor: '#404040', color: '#a0b6f7' },
        { backgroundColor: '#1d5c96', color: '#7db0de' },
        { backgroundColor: '#abd1ff', color: '#e54b22' },
        { backgroundColor: '#0f4d19', color: '#6fc27c' },
        { backgroundColor: '#efc8b1', color: '#8a6626' },
        { backgroundColor: '#008970', color: '#99eedf' },
        { backgroundColor: '#bdfff6', color: '#e23c52' },
        { backgroundColor: '#390879', color: '#b8df10' },
        { backgroundColor: '#551fbd', color: '#a2eacb' },
        { backgroundColor: '#efc8b1', color: '#514644' },
        { backgroundColor: '#337def', color: '#fcc729' },
        { backgroundColor: '#a9dce3', color: '#7689de' },
        { backgroundColor: '#0e387a', color: '#9fafca' },
        { backgroundColor: '#ffe042', color: '#e71989' },
        { backgroundColor: '#f4b41a', color: '#143d59' },
    ];

    const handleSubmit = async e => {
        e.preventDefault();

        const rndNr = Math.floor(Math.random() * (colors.length - 1));
        const userColors = colors[rndNr];
        setUser({ name: userName, colors: userColors, karma: 100, userId: uuidv4() });
    };

    return (
        <div className="fake-body">
            <div className="text-center">

                <form className="form-signin" onSubmit={handleSubmit}>
                    <h1 className="h1 mb-3 font-weight-normal" style={{ color: '#7689de' }}>Chattix</h1>
                    {/* <h5 className="h5 mb-3 font-weight-normal">Please enter username</h5> */}
                    <label htmlFor="inputName" className="sr-only">Enter your name</label>
                    <input
                        type="text"
                        id="inputName"
                        className="form-control mb-3"
                        placeholder="Enter your name"
                        required
                        autoFocus=""
                        maxLength={32}
                        onChange={e => setUserName(e.target.value)} />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Let's go!</button>
                </form>

            </div>
        </div>
    )
};

export default Login;