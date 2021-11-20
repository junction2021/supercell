import React, { useState, useEffect, useRef } from "react";
import Countdown from "react-countdown";
import { Button } from "reactstrap";
import Chat from "../ChatV2/Chatv2";
import GameOver from "./GameOver";
import { HubConnectionBuilder } from '@microsoft/signalr';
import OnlineCounter from './OnlineCounter';

const Game = (props) => {
    const [karma, setKarma] = useState(100);
    const [connected, setConnected] = useState(false);

    const [completed, setCompleted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <GameOver />;
        } else {
            return <h5>{seconds < 10 ? `0${seconds}` : seconds}</h5>;
        }
    };

    const onComplete = () => {
        setCompleted(true);
    };

    const restart = () => {
        setCurrentTimeIndex(currentTimeIndex + 1);
        setTimer(Date.now() + 60000);
    };

    const [connection, setConnection] = useState(null);

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
                    setConnected(true);

                    connection.on('ReceiveMessage', (user, color, message, karma) => {
                        if (user === props.user.name) {
                            setKarma(karma);                            
                        }
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {
        restart();
    }, []);

    return !connected ?
        <div>Loading...</div> :
        <div className="page-content page-container" id="page-content">
            <div className="row container-fluid d-flex justify-content-center">
                <div className="col-md-12 pt-3">
                    <div className="jumbotron jumbotron-fluid text-center">
                        <h1 className="text-center">Game in progress...</h1>
                        <h4>Your current Karma: <span 
                            className={karma >= 60 ? 'text-success' : karma <= 30 ? 'text-danger' : 'text-secondary' }
                            >{karma}</span></h4>
                        {/* <Countdown
                            date={timer}
                            key={currentTimeIndex}
                            onComplete={onComplete}
                            renderer={renderer} />
                        <Button className="mt-3" color="primary" onClick={restart}>Restart</Button> */}
                        <OnlineCounter connection={connection} />
                    </div>
                </div>
                <div className="col-md-12 fixed-bottom">
                    <Chat loggedUser={props.user} connection={connection} />
                </div>
            </div>
        </div>
        ;
};

export default Game;