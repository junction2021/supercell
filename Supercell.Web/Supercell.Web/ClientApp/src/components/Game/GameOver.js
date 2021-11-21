import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

const GameOver = (props) => {
    const [open, setOpen] = useState(true);

    return (
        <Modal size={'xl'} isOpen={open} toggle={() => setOpen(false)}>
            <ModalHeader>
                Game over!
            </ModalHeader>
            <ModalBody>
                <h1>You cloud do better! :(</h1>
                <p>Here is the list of things that you said was super duper wrong!</p>
                <ul>
                   <li>Yo mama so fat. [-10 Karma]</li> 
                   <li>Suck a bag of dicks [-10 Karma]</li> 
                </ul>
            </ModalBody>
        </Modal>
    );
};

export default GameOver;