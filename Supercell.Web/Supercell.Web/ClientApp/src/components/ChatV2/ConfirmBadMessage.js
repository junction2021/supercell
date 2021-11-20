import React, { useState, useEffect, useRef } from "react";
import { Alert, Button, Progress } from "reactstrap";

const ConfirmBadMessage = ({ betterMessage, confirm, dismiss }) => {
    const [countDown, setCountDown] = useState(100);

    const secondPassed = () => {
        if (countDown === 0) {
            dismiss();
        }
        setCountDown(countDown - 1);
    };

    useEffect(() => {
        const timer = setInterval(secondPassed, 100);
        return () => clearInterval(timer);
    });

    return (
        <Alert style={{cursor:'pointer'}} color={'warning'} className="ml-4 mr-4" onClick={confirm}>
            <h4 className="alert-heading">Don't lose your Karma!</h4>
            <hr />
            <p>Stop being so toxic, here write this instead:</p>
            <p className="mb-0">{betterMessage}</p>
            <Progress style={{ height: '3px' }} animated value={countDown} color="warning" />
        </Alert>
    );
};

export default ConfirmBadMessage;