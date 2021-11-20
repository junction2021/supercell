import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from "react";

const OnlineCounter = ({ connection }) => {
    const [usersOnline, setUsersOnline] = useState(0);

    useEffect(() => {
        connection.on('UserConencted', (online) => {
            setUsersOnline(online);
        });
        connection.on('UserDisconnected', (online) => {
            setUsersOnline(online);
        });
    }, [connection]);

    return (
        <div className={"mt-3"}>
            <strong style={{ color: 'red' }}><FontAwesomeIcon icon={faUser} /> {usersOnline}</strong>
        </div>
    );
};

export default OnlineCounter;